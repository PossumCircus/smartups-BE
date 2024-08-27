const nodemailer = require('nodemailer');

// Configuration (Update with your email provider details)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service (e.g., 'gmail', 'outlook', etc.)
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail({ to, subject, html }) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS, // Your sender email address
            to,
            subject,
            html 
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error); 
        throw error;  // Re-throw to allow for error handling where sendEmail is called
    }
}

module.exports = {
    sendEmail 
};
