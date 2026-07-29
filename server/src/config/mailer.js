import nodemailer from 'nodemailer';
import env from './env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP provider
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD, // app password, not your real Gmail password
  },
});

export default transporter;