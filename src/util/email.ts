const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

export async function sendPasswordResetEmail(email, token) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `Please click the following link to reset your password:\n
           http://${process.env.PUBLIC_URL}/reset-password?token=${token}`
  };
}