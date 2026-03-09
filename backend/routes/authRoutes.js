import express from 'express';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import axios from "axios";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcryptjs";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// const isValidLink = async (url) => {
//   try {
//     const res = await axios.head(url, { timeout: 5000 });
//     return res.status >= 200 && res.status < 400;
//   } catch (err) {
//     return false;
//   }
// };


const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "OTP verification is only required for students"
      });
    }

    if (user.profile?.emailVerification?.isVerified) {
      console.log("Email already verified")
      return res.json({ message: "Email already verified" });
    }

    // generate otp
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.profile.emailVerification = {
      isVerified: false,
      otpHash,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      otpAttempts: 0
    };

    await user.save();

    // email html
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#4f46e5">Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Your verification code is:</p>

        <div style="
          font-size:32px;
          letter-spacing:6px;
          font-weight:bold;
          background:#f3f4f6;
          padding:20px;
          text-align:center;
          border-radius:8px;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p>If you did not request this, please ignore this email.</p>

        <hr>
        <p style="font-size:12px;color:#666">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Email Verification OTP",
      html
    });

    res.json({
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;


    const user = await User.findOne({ email });
    const ev = user.profile.emailVerification;

    if (!ev || !ev.otpHash) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (ev.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const valid = await bcrypt.compare(otp.trim(), ev.otpHash);

    if (!valid) {
      ev.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // success
    ev.isVerified = true;
    ev.otpHash = null;
    ev.otpExpires = null;
    ev.otpAttempts = 0;

    await user.save();

    return res.json({
      message: "Email verified successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/resend-email-otp", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.profile.emailVerification.isVerified) {
    return res.json({ message: "Already verified" });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.profile.emailVerification.otpHash = otpHash;
  user.profile.emailVerification.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendEmail({
    to: email,
    subject: "New OTP",
    html: `<h3>Your new OTP: ${otp}</h3>`
  });

  res.json({ message: "OTP resent" });
});

// Register
router.post('/register', async (req, res) => {
  try {
    // --- Helper utilities ---
    const normalizeArray = (value) => {
      if (value == null) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [value];
    };

    const normalizeCerts = (certs) => {
      if (!certs) return [];
      const arr = Array.isArray(certs) ? certs : [certs];
      return arr.map((c) => ({
        name: String(c?.name || c || ''),
        issuer: c?.issuer || '',
        year: c?.year ? Number(c.year) : (c?.issuedDate ? new Date(c.issuedDate).getFullYear() : null),
        issuedDate: c?.issuedDate || null,
        certificateLink: c?.certificateLink || '',
        certificateImage: typeof c?.certificateImage === 'string' ? c.certificateImage : '',
      }));
    };

    // prints the body for debugging
    const cleanBody = JSON.parse(JSON.stringify(req.body || {}));
    if (cleanBody.profile && cleanBody.profile.resume) {
      delete cleanBody.profile.resume;
    }
    // console.log('REGISTER API RECEIVED →', JSON.stringify(cleanBody, null, 2));

    // ---logic starts

    // Destructure top-level fields
    const { name, email, password, role } = req.body || {};

    // Safe-get profile object
    const incomingProfile = req.body?.profile || {};

    // Normalize all expected profile fields (we accept multiple aliases)
    const education = incomingProfile.education || incomingProfile.educationLevel || '';
    const teachingExperienceDetails = incomingProfile.teachingExperienceDetailsDescription
      || incomingProfile.teachingExperienceDetails
      || incomingProfile.teachingDetails
      || '';
    // Experience number: prefer numeric 'experience', or try parse teachingExperienceDetails if numeric string
    const experienceRaw = incomingProfile.experience ?? incomingProfile.yearsOfExperience ?? incomingProfile.teachingExperience;
    const experience = Number.isFinite(Number(experienceRaw)) ? parseInt(String(experienceRaw), 10) : 0;

    const certificationsRaw = incomingProfile.certifications || incomingProfile.certs || [];
    const certifications = normalizeCerts(certificationsRaw);

    const dob = incomingProfile.dob || null;
    const bio = incomingProfile.bio || '';
    const resume = incomingProfile.resume || '';
    const phone = incomingProfile.phone || '';
    const continent = incomingProfile.continent || '';
    const nationalityCode = incomingProfile.nationalityCode || incomingProfile.countryCode || incomingProfile.country || '';
    const location = incomingProfile.location || incomingProfile.city || '';
    const hobbies = normalizeArray(incomingProfile.hobbies || incomingProfile.hobby || incomingProfile.interests);
    const languages = normalizeArray(incomingProfile.languages || incomingProfile.langs || incomingProfile.language);
    const subjects = normalizeArray(incomingProfile.subjects || incomingProfile.specializations || incomingProfile.teachingSubjects);
    const standards = normalizeArray(incomingProfile.standards || incomingProfile.gradeLevels || incomingProfile.levels);

    // Security: validate role
    const allowedRoles = ['student', 'trainer'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Invalid role' });
    }

    // Cooldown for re-registration (trainer)
    const COOLDOWN_MS = 2 * 60 * 1000;
    // testing 2 minutes, change to 6 months in prod as needed

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    // -------- Existing user flow
    if (existingUser) {
      // Trainer re-registration (only allowed when previous status was 'rejected')
      if (existingUser.role === 'trainer' && existingUser.profile?.verificationStatus === 'rejected') {
        const now = new Date();
        const rejectionTime = existingUser.profile.rejectionDate ? new Date(existingUser.profile.rejectionDate) : now;
        if (now - rejectionTime < COOLDOWN_MS) {
          return res.status(400).json({
            message: 'You can re-register only after the cooldown period. Please wait a few minutes for testing.',
          });
        }

        // Update password
        existingUser.password = password;

        // Update trainer profile fields (preserve old values if new ones not provided)
        existingUser.profile.education = education || incomingProfile.education || existingUser.profile.education || '';
        existingUser.profile.teachingExperienceDetails =
          teachingExperienceDetails || incomingProfile.teachingExperienceDetails || existingUser.profile.teachingExperienceDetails || '';
        existingUser.profile.experience = Number.isFinite(experience) ? experience : (existingUser.profile.experience || 0);

        // Certifications
        existingUser.profile.certifications = certifications.length ? certifications : (existingUser.profile.certifications || []);

        // Phone, dob, bio
        existingUser.profile.phone = phone || incomingProfile.phone || existingUser.profile.phone || '';
        existingUser.profile.dob = dob || incomingProfile.dob || existingUser.profile.dob || null;
        existingUser.profile.bio = bio || incomingProfile.bio || existingUser.profile.bio || '';

        // Languages / specializations / standards / hobbies / location / nationalityCode
        existingUser.profile.languages = languages.length ? languages : (existingUser.profile.languages || []);
        existingUser.profile.specializations = subjects.length ? subjects : (existingUser.profile.specializations || []);
        existingUser.profile.standards = standards.length ? standards : (existingUser.profile.standards || []);
        existingUser.profile.hobbies = hobbies.length ? hobbies : (existingUser.profile.hobbies || []);
        existingUser.profile.location = location || incomingProfile.location || existingUser.profile.location || '';
        existingUser.profile.nationalityCode = nationalityCode || incomingProfile.nationalityCode || existingUser.profile.nationalityCode || '';

        // Mark pending & clear rejection date
        existingUser.profile.verificationStatus = 'pending';
        existingUser.profile.rejectionDate = null;

        // update resume if provided
        if (resume) {
          existingUser.profile.resume = resume;
        }

        await existingUser.save();

        // Send verification email (attach resume if provided) — still pass resume string to email helper
        sendTrainerVerificationEmail(existingUser, resume)
          .then(() => console.log('✅ Verification email sent'))
          .catch(err => console.error('❌ Email sending failed:', err));

        return res.status(200).json({
          message: 'You have re-registered successfully. Awaiting verification.',
          user: existingUser,
        });
      }

      // Otherwise user exists and can't re-register
      return res.status(400).json({ message: 'User already exists' });
    }

    // ----------------- New user registration -----------------
    // Build profile payload consistently for both trainer & student
    const profilePayload = {
      // common fields
      phone,
      continent,
      location,
      nationalityCode,
      bio,
    };

    if (role === 'trainer') {
      profilePayload.education = education || '';
      profilePayload.teachingExperienceDetails = teachingExperienceDetails || '';
      profilePayload.experience = Number.isFinite(experience) ? experience : 0;
      profilePayload.certifications = certifications;
      profilePayload.dob = dob || null;
      profilePayload.verificationStatus = 'pending';

      profilePayload.hobbies = hobbies;
      profilePayload.languages = languages;
      profilePayload.specializations = subjects;
      profilePayload.standards = standards;
      profilePayload.resume = resume;

    } else if (role === 'student') {
      profilePayload.phone = phone || '';
      profilePayload.learningType = incomingProfile.learningType || '';
      profilePayload.learningValues = Array.isArray(incomingProfile.learningValues)
        ? incomingProfile.learningValues
        : incomingProfile.learningValues
          ? normalizeArray(incomingProfile.learningValues)
          : [];
      profilePayload.standards = standards;
      // stores student selected subjects under 'specializations' 
      profilePayload.specializations = subjects;
    }

    // Build final user object
    const userData = {
      name,
      email,
      password,
      role,
      profile: profilePayload,
    };

    // Save user
    const user = new User(userData);
    await user.save();

    // If trainer -> send verification email (non-blocking)
    if (role === 'trainer') {
      sendTrainerVerificationEmail(user, resume)
        .then(() => console.log('✅ Verification email sent'))
        .catch(err => console.error('❌ Email sending failed:', err));
    }

    // Issue JWT token (unchanged)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    // Respond with created user info (profile returned as saved)
    res.status(201).json({
      message: role === 'trainer'
        ? 'Trainer registered successfully. Awaiting verification.'
        : 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(400).json({ message: error?.message || 'Registration error' });
  }
});

// Check email status on registration
router.post('/check-email', async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ exists: false }); // allow new user
    }

    // If student
    if (user.role === "student") {
      return res.json({
        exists: true,
        blocked: true,
        message: "A student account already exists with this email."
      });
    }

    // If trainer
    if (user.role === "trainer") {

      if (user.profile.verificationStatus === "pending") {
        return res.json({
          exists: true,
          blocked: true,
          message: "Your verification is still pending. Please wait for its Approval."
        });
      }

      if (user.profile.verificationStatus === "verified") {
        return res.json({
          exists: true,
          blocked: true,
          message: "This trainer is already verified and registered."
        });
      }

      if (user.profile.verificationStatus === "rejected") {

        const rejectionDate = user.profile.rejectionDate;

        if (!rejectionDate) {
          return res.json({
            exists: true,
            blocked: true,
            message: "Your previous application was rejected. Please wait 6 months before re-applying."
          });
        }

        const now = new Date();
        const rejectedOn = new Date(rejectionDate);
        const diffMonths =
          (now.getFullYear() - rejectedOn.getFullYear()) * 12 +
          (now.getMonth() - rejectedOn.getMonth());

        if (diffMonths < 6) {
          return res.json({
            exists: true,
            blocked: true,
            message: `You may re-apply after ${6 - diffMonths} more month(s).`
          });
        }

        // If 6 months have passed → allow re-apply
        return res.json({
          exists: true,
          blocked: false,
          message: "You can re-register since 6 months have passed after your rejection."
        });
      }
    }

    res.json({ exists: true, blocked: true, message: "Account exists already." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper to send email to admin for trainer verification
const sendTrainerVerificationEmail = async (user, resumeData) => {
  const { profile } = user;

  // Determine teaching type and values
  let teachingType = 'N/A';
  let teachingValues = ['N/A'];

  if (profile.specializations?.length) {
    teachingType = 'Subjects';
    teachingValues = profile.specializations;
  } else if (profile.languages?.length) {
    teachingType = 'Languages';
    teachingValues = profile.languages;
  } else if (profile.hobbies?.length) {
    teachingType = 'Hobbies';
    teachingValues = profile.hobbies;
  }

  // Certifications List (HTML)
  const certList =
    profile.certifications && profile.certifications.length
      ? profile.certifications
        .map(
          (c, i) => `
      <div style="padding:8px; border-left:3px solid #4f46e5; background:#f8f8ff; margin-bottom:12px;">
        <b>${i + 1}. ${c.name || 'N/A'}</b><br>
        <b>Issuer:</b> ${c.issuer || 'N/A'}<br>
        <b>Issued:</b> ${c.issuedDate ? new Date(c.issuedDate).toLocaleDateString() : 'N/A'
            }<br>
        <b>Year:</b> ${c.year || 'N/A'}<br>
        <b>Certificate Link (optional):</b> ${c.certificateLink
              ? isValid
                ? `<a href="${c.certificateLink}" target="_blank">View</a>`
                : `<span style="color:red;">Invalid Link</span>`
              : 'None'
            }
      </div>
    `
        )
        .join('')
      : `<p>No certifications provided.</p>`;

  // Approve / Reject Links
  const verifyToken = jwt.sign({ trainerId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const approveLink = `${process.env.FRONTEND_URL}/api/auth/verify-trainer/${verifyToken}?action=approve`;
  const rejectLink = `${process.env.FRONTEND_URL}/api/auth/verify-trainer/${verifyToken}?action=reject`;

  // FINAL BODY
  const htmlBody = `
    <h2 style="color:#4f46e5;">Trainer Registration - Verification Required</h2>

    <p><b>Name:</b> ${user.name}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>Phone:</b> ${profile.phone || 'N/A'}</p>
    <p><b>Location:</b> ${profile.location || 'N/A'}</p>
    <p><b>Nationality:</b> ${profile.nationalityCode || 'N/A'}</p>

    <hr>

    <h3>Trainer Details</h3>
    <p><b>Highest Qualification:</b> ${profile.education || 'N/A'}</p>
    <p><b>Experience (Years):</b> ${profile.experience || 0}</p>
    <p><b>Bio:</b> ${profile.bio || 'N/A'}</p>

    <p><b>Teaching Type:</b> ${teachingType}</p>
    <p><b>Teaching Values:</b> ${teachingValues.join(', ')}</p>

    ${profile.languages?.length
      ? `<p><b>Languages:</b> ${profile.languages.join(', ')}</p>`
      : ''
    }

    ${profile.hobbies?.length
      ? `<p><b>Hobbies:</b> ${profile.hobbies.join(', ')}</p>`
      : ''
    }

    ${profile.specializations?.length
      ? `<p><b>Subjects:</b> ${profile.specializations.join(', ')}</p>`
      : ''
    }

    ${profile.specializations?.length
      ? `<p><b>Standards:</b> ${profile.standards?.length ? profile.standards.join(', ') : 'None'
      }</p>`
      : ''
    }


    <p><b>Date of Birth:</b> ${profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'
    }</p>

    <hr>

    <h3>Certifications</h3>
    ${certList}

    <hr>

    <h3>Verification Controls</h3>
    <p>Click below to verify or reject this trainer:</p>
    <p>
      <a href="${approveLink}" style="padding:10px 15px; background:#22c55e; color:white; text-decoration:none; border-radius:6px;">Approve</a>
    </p>
    <p>
      <a href="${rejectLink}" style="padding:10px 15px; background:#ef4444; color:white; text-decoration:none; border-radius:6px;">Reject</a>
    </p>
  `;

  // Attach Resume 
  const attachments = [];
  if (resumeData && typeof resumeData === 'string' && resumeData.startsWith('data:')) {
    const base64Data = resumeData.split(';base64,').pop();
    attachments.push({
      filename: 'resume.pdf',
      content: base64Data,
      encoding: 'base64',
    });
  }

  // Certifications for attachments
  if (profile.certifications?.length) {
    for (const cert of profile.certifications) {
      const file = cert.certificateFile || cert.certificateImage;

      if (file && file.startsWith('data:')) {
        attachments.push({
          filename: `${cert.name || 'certificate'}.png`,
          content: file.split(';base64,').pop(),
          encoding: 'base64',
        });
      }
    }
  }
  // Send Email
  await sendEmail({
    to: process.env.ADMIN_VERIFICATION_EMAIL,
    subject: `Trainer Verification Required - ${user.name}`,
    html: htmlBody,
    attachments,
  });
};
// End of helper

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //for admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        token,
        user: {
          id: 'admin_static_id',
          name: 'Super Admin',
          email,
          role: 'admin'
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist, Sign Up Now!' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Block unverified trainers
    if (user.role === 'trainer') {
      if (user.profile.verificationStatus === 'pending') {
        return res.status(403).json({
          message: 'Your account verification is still pending. Please wait until it is approved.'
        });
      }
      if (user.profile.verificationStatus === 'rejected') {
        return res.status(403).json({
          message: 'Your account verification was rejected. You may re-apply after 6 months from your previous registration.'
        });
      }
    }

    if (
      user.role === "student" &&
      !user.profile.emailVerification?.isVerified
    ) {
      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email using the OTP sent to your inbox.",
        requiresEmailVerification: true,
        email: user.email
      });
    }


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profile: req.user.profile,
    stats: req.user.stats
  });
});

// ---------------- FORGOT PASSWORD ----------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // token valid for 15 minutes
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlBody = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
      <a href="${resetLink}" style="color:blue;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: htmlBody
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Something went wrong, try again later.' });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// ---------- VERIFY TRAINER VIA EMAIL LINK ---------------
router.get('/verify-trainer/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { action } = req.query; // approve or reject

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const trainerId = decoded.trainerId;

    const trainer = await User.findById(trainerId);
    if (!trainer) return res.status(404).send('Trainer not found');

    if (trainer.profile.verificationStatus !== 'pending') {
      return res.status(400).send('Trainer already verified or rejected');
    }

    if (action === 'approve') {
      trainer.profile.verificationStatus = 'verified';
      await trainer.save();

      // Send approval email to trainer
      const htmlBody1 = `
        <h2>Congratulations, ${trainer.name}!</h2>
        <p>Your documents have been verified successfully.</p>
        <p>You can now log in using your registered email and password.</p>
      `;

      await sendEmail({
        to: trainer.email,
        subject: 'Trainer Verification Approved',
        html: htmlBody1
      });

      return res.send(`
        <html>
          <head>
            <title>Trainer Verified</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
              .container { background: white; padding: 30px; border-radius: 10px; display: inline-block; }
              h1 { color: green; }
              a { color: #007bff; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Trainer Verified!</h1>
              <p>${trainer.name} has been successfully approved.</p>
            </div>
          </body>
        </html>
      `);
    }

    if (action === 'reject') {
      trainer.profile.verificationStatus = 'rejected';
      trainer.profile.rejectionDate = new Date();
      // set rejection date
      await trainer.save();

      // Send rejection email
      const htmlBody1 = `
        <h2>Hello ${trainer.name},</h2>
        <p>Unfortunately, your trainer verification has been rejected.</p>
        <p>Please review your submitted details and try again after cooldown period of 6 months.</p>
      `;

      await sendEmail({
        to: trainer.email,
        subject: 'Trainer Verification Rejected',
        html: htmlBody1
      });

      return res.send(`
        <html>
          <head>
            <title>Trainer Rejected</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
              .container { background: white; padding: 30px; border-radius: 10px; display: inline-block; }
              h1 { color: green; }
              a { color: #007bff; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Trainer Rejected!</h1>
              <p>${trainer.name}  has been successfully rejected and notified..</p>
            </div>
          </body>
        </html>
      `);
    }

    res.status(400).send('Invalid action');
  } catch (error) {
    console.error('Verification link error:', error);
    res.status(400).send('Invalid or expired link');
  }
});

//for google authentication
router.post('/google-login', async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email } = payload;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist. Please register first." });
    }

    if (user.role === 'trainer') {
      if (user.profile.verificationStatus === 'pending') {
        return res.status(403).json({
          message: 'Your account verification is still pending. Please wait until it is approved.'
        });
      }
      if (user.profile.verificationStatus === 'rejected') {
        return res.status(403).json({
          message: 'Your account verification was rejected.'
        });
      }
    }

    if (
      user.role === "student" &&
      !user.profile?.emailVerification?.isVerified
    ) {
      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email using the OTP sent to your inbox.",
        requiresEmailVerification: true,
        email: user.email
      });
    }

    // if verified -> token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(400).json({ message: "Google authentication failed" });
  }
});


//for facebook login
router.post('/facebook-login', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const url = `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    const { email, name, id } = data;
    if (!email) {
      return res.status(400).json({ message: "Facebook email not found." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist. Please register first." });
    }

    if (user.role === 'trainer') {
      if (user.profile.verificationStatus === 'pending') {
        return res.status(403).json({
          message: 'Your account verification is still pending. Please wait until it is approved.'
        });
      }
      if (user.profile.verificationStatus === 'rejected') {
        return res.status(403).json({
          message: 'Your account verification was rejected.'
        });
      }
    }

    if (
      user.role === "student" &&
      !user.profile?.emailVerification?.isVerified
    ) {
      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email using the OTP sent to your inbox.",
        requiresEmailVerification: true,
        email: user.email
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    if (error.response) {
      console.error("Facebook Error Detail:", error.response.data);
    }
  }
});
export default router;
