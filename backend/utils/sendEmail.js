// utils/sendEmail.js
import { Resend } from 'resend';

export const sendEmail = async (options) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        // convert env string → array
        const ccEmails = process.env.CAREER_CC_EMAILS
            ? process.env.CAREER_CC_EMAILS.split(',').map(e => e.trim())
            : [];

        await resend.emails.send({
            from: process.env.FROM_EMAIL,
            // no-reply@learnilmworld.com
            to: options.to,
            cc: options.cc || ccEmails,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments?.map(file => ({
                filename: file.filename,
                content: file.content,
            })) || [],
        });
    } catch (error) {
        console.error("Resend email error:", error);
        throw new Error("Email sending failed");
    }
};

export default sendEmail;

// ----------------------------------------------------
// Previous nodemailer code
// ----------------------------------------------------
// utils/sendEmail.js
// import nodemailer from 'nodemailer';

// export const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     const mailOptions = {
//         from: `"Trainer Verification" <${process.env.EMAIL_USER}>`,
//         to: options.to,
//         subject: options.subject,
//         html: options.html,
//         attachments: options.attachments || []
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default sendEmail