// routes/adminRoutes.ts
import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js'
import Session from '../models/Session.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import adminCourseRoutes from './admin/adminCourseRoutes.js';
import { v4 as uuidv4 } from 'uuid';



const router = express.Router();

// Apply authentication and admin role check to all routes
router.use(authenticate, authorize(['admin']));
// after authnticate for admin access only. 
router.use("/courses", adminCourseRoutes);

// ============= ADMIN DASHBOARD STATS ===========

router.get('/dashboard-stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalTrainers = await User.countDocuments({ role: 'trainer' })
        const totalSessions = await Session.countDocuments()
        const totalReviews = await Review.countDocuments()

        // For recent sessions
        const recentSessions = await Session.find()
            .populate('trainer', 'name email')
            .sort({ createdAt: -1 })
            .limit(3)

        res.json({
            totalUsers,
            totalTrainers,
            totalSessions,
            totalReviews,
            recentSessions
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        res.status(500).json({ message: 'Failed to fetch admin stats' })
    }
})


// Fetch all users - Admin only
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        const normalizedUsers = users.map(u => {
            const obj = u.toObject();

            if (!obj.profile) obj.profile = {};
            if (!obj.profile.resume) obj.profile.resume = "";

            return obj;
        });

        res.json(normalizedUsers);

    } catch (error) {
        console.error('Admin fetch users error:', error)
        res.status(500).json({ message: 'Server error while fetching users.' })
    }
})

// fetch single user
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
});

// create users i.e. trainer/student directly.
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, profile } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists.' });


        const newUser = new User({
            name,
            email,
            password,
            role: role || 'student',
            profile: profile || {},
        });

        await newUser.save();
        res.status(201).json({
            message: 'User created successfully.',
            user: { ...newUser.toObject(), password: undefined },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
});

// update users as well as accept or reject trainer
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role, profile, password, verificationStatus, emailVerified, } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (profile) {
            for (const key in profile) {
                user.set(`profile.${key}`, profile[key]);
            }
        }



        // Approve/reject trainer without sending email
        if (verificationStatus && user.role === 'trainer') {
            if (['pending', 'verified', 'rejected'].includes(verificationStatus)) {
                user.profile.verificationStatus = verificationStatus;
                if (verificationStatus === 'rejected') user.profile.rejectionDate = new Date();
                if (verificationStatus === 'verified') user.profile.rejectionDate = null;
            }
        }

        //  EMAIL VERIFICATION (ADMIN OVERRIDE) 
        if (typeof emailVerified === 'boolean') {
            user.profile.emailVerification.isVerified = emailVerified;

            // Cleanup OTP data if verified
            if (emailVerified) {
                user.profile.emailVerification.otpHash = null;
                user.profile.emailVerification.otpExpires = null;
                user.profile.emailVerification.otpAttempts = 0;
            }
        }

        if (password) {
            user.password = password;
        }

        await user.save();
        await user.populate();

        if (password) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Your Password Has Been Updated',
                    text: `Hello ${user.name},\n\nYour account password has been updated by an administrator. If this wasn't you, please reset your password immediately or contact support.\n\nThank you,\nLearn🌎Sphere Team`
                });
            } catch (emailError) {
                console.error('Error sending password change email:', emailError);
            }
        }

        res.json({
            message: 'User updated successfully.',
            user: { ...user.toObject(), password: undefined },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
});

// delete a user.
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        await user.deleteOne();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
});

// approve or reject trainer
router.patch('/users/:id/verify', async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.role !== 'trainer') return res.status(400).json({ message: 'Only trainers can be verified.' });

        if (action === 'approve') {
            user.profile.verificationStatus = 'verified';
            user.profile.rejectionDate = null;
        } else if (action === 'reject') {
            user.profile.verificationStatus = 'rejected';
            user.profile.rejectionDate = new Date();
        } else {
            return res.status(400).json({ message: 'Invalid action. Must be "approve" or "reject".' });
        }

        await user.save();
        res.json({
            message: `Trainer ${action}d successfully.`,
            user: { ...user.toObject(), password: undefined },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while verifying trainer.' });
    }
});



// ----------trainers---------


// Fetch all trainers with their stats
router.get('/trainers', async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('-password')

        const result = await Promise.all(
            trainers.map(async (trainer) => {
                const sessions = await Session.find({ trainer: trainer._id })
                const bookings = await Booking.find({ trainer: trainer._id })
                const completedSessions = sessions.filter(s => s.status === 'completed').length
                const students = new Set(bookings.map(b => String(b.student))).size

                return {
                    ...trainer.toObject(),
                    dashboardStats: {
                        totalSessions: sessions.length,
                        completedSessions,
                        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length,
                        totalStudents: students,
                        totalEarnings: trainer.stats?.totalEarnings || 0,
                        averageRating: trainer.stats?.rating || 5.0
                    }
                }
            })
        )

        res.json(result)
    } catch (err) {
        console.error('Error fetching trainer stats:', err)
        res.status(500).json({ message: 'Failed to fetch trainers data' })
    }
})

router.get('/bookings/trainer/:trainerId', async (req, res) => {
    const bookings = await Booking.find({
        trainer: req.params.trainerId,
        paymentStatus: 'completed',
    }).populate('student', 'name email')
    res.json(bookings)
})


// -----------Sessions-------

// ====================== ADMIN: SESSIONS MANAGEMENT ======================

// Fetch all sessions
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate('trainer', 'name email profile')
            .populate('students', 'name email')
            .populate('bookings')
            .sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Failed to fetch sessions.' });
    }
});

// Create session for any trainer
router.post('/sessions', async (req, res) => {
    try {
        const { trainerId, bookingIds, title, description, duration, maxStudents, language, level, scheduledDate } = req.body;

        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(400).json({ message: 'Invalid trainer ID' });
        }

        const bookings = await Booking.find({
            _id: { $in: bookingIds },
            trainer: trainerId,
            paymentStatus: 'completed'
        });

        if (bookings.length === 0) {
            return res.status(400).json({ message: 'No valid bookings found for this trainer' });
        }

        const studentIds = bookings.map(b => b.student);
        const jitsiRoomName = `admin-session-${uuidv4()}`;
        const jitsiLink = `https://meet.jit.si/${jitsiRoomName}`;

        const session = new Session({
            trainer: trainerId,
            students: studentIds,
            bookings: bookingIds,
            title,
            description,
            jitsiLink,
            jitsiRoomName,
            duration,
            maxStudents,
            language,
            level,
            scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date()
        });

        await session.save();
        await session.populate(['trainer', 'students', 'bookings']);

        await Booking.updateMany(
            { _id: { $in: bookingIds } },
            { sessionId: session._id }
        );

        await User.findByIdAndUpdate(trainerId, {
            $inc: { 'stats.totalSessions': 1 }
        });

        res.status(201).json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Failed to create session.' });
    }
});

// Update session
router.put('/sessions/:id', async (req, res) => {
    try {
        const updates = req.body;
        delete updates.jitsiLink;
        delete updates.jitsiRoomName;

        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate(['trainer', 'students', 'bookings']);

        if (!session) return res.status(404).json({ message: 'Session not found.' });
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete session
router.delete('/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found.' });

        await Booking.updateMany(
            { sessionId: session._id },
            { $unset: { sessionId: 1 } }
        );

        await session.deleteOne();
        res.json({ message: 'Session deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// ====================== ADMIN: REVIEWS MANAGEMENT ======================

// Fetch all reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('trainer', 'name email')
            .populate('student', 'name email')
            .populate('session', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews.' });
    }
});

// Delete a review
router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found.' });

        const trainerId = review.trainer;
        await Review.findByIdAndDelete(req.params.id);

        // Recalculate average rating for trainer
        const trainerReviews = await Review.find({ trainer: trainerId });
        const averageRating =
            trainerReviews.length > 0
                ? trainerReviews.reduce((sum, r) => sum + r.rating, 0) / trainerReviews.length
                : 5.0;

        await User.findByIdAndUpdate(trainerId, {
            'stats.rating': Math.round(averageRating * 10) / 10,
            'profile.averageRating': Math.round(averageRating * 10) / 10,
        });

        res.json({ message: 'Review deleted successfully.' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error while deleting review.' });
    }
});


export default router;
