import nodemailer from 'nodemailer';

// Helper to determine if mail is fully configured
const isMailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

let transporter = null;

if (isMailConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.warn(
    '\n======================================================\n' +
    '  [WARNING] Mailer is not configured.\n' +
    '  Please set EMAIL_USER and EMAIL_PASS in your .env file.\n' +
    '  Emails will fallback to console logging.\n' +
    '======================================================\n'
  );
}

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Portfolio Portal" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@portfolio.dev'}>`,
    to,
    subject,
    text,
    html,
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent: ${info.messageId}`);
      return { success: true, info };
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  } else {
    console.log('\n======================================================');
    console.log('            [FALLBACK EMAIL LOGGING]');
    console.log(`  To:       ${to}`);
    console.log(`  Subject:  ${subject}`);
    console.log(`  Text:     ${text}`);
    console.log('======================================================\n');
    return { success: true, fallback: true };
  }
};
