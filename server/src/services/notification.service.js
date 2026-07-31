import transporter from '../config/mailer.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

const send = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"EvenUp" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    logger.error('Email notification failed:', err.message);
  }
};

export const notifyExpenseAdded = async (recipients, { groupName, description, amount, addedBy }) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>New expense in ${groupName}</h2>
      <p><strong>${addedBy}</strong> added an expense:</p>
      <p style="font-size: 18px;"><strong>${description}</strong> — PKR ${amount}</p>
      <p style="color: #64748b; font-size: 13px;">Log in to EvenUp to see your updated balance.</p>
    </div>
  `;

  await Promise.all(
    recipients.map((email) => send({ to: email, subject: `New expense in ${groupName}`, html }))
  );
};

export const notifySettlement = async (recipientEmail, { fromName, amount, groupName }) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Payment received</h2>
      <p><strong>${fromName}</strong> paid you PKR ${amount} ${groupName ? `in ${groupName}` : ''}.</p>
    </div>
  `;
  await send({ to: recipientEmail, subject: 'Payment received on EvenUp', html });
};

export const notifyPasswordReset = async (email, { resetToken, name }) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Reset your password</h2>
      <p>Hi ${name}, click the button below to reset your EvenUp password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;margin-top:10px;">Reset Password</a>
      <p style="color:#64748b;font-size:13px;margin-top:20px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
  await send({ to: email, subject: 'Reset your EvenUp password', html });
};