// email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail(to, subject, template) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: template,
    };

    await transporter.sendMail(mailOptions);
}
