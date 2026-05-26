const nodemailer = require('nodemailer');
const twilio = require('twilio');

let transporter;
let twilioClient;

function getEmailTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function getTwilioClient() {
  if (twilioClient) return twilioClient;

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SERVICE_SID) {
    return null;
  }

  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
}

function buildE164IndianNumber(recipient) {
  const digits = String(recipient || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  if (String(recipient || '').trim().startsWith('+')) {
    return String(recipient).trim();
  }

  throw new Error('Enter a valid 10-digit mobile number');
}

async function sendEmailOtp(recipient, code) {
  const emailTransporter = getEmailTransporter();
  if (!emailTransporter) {
    return {
      sent: false,
      mode: 'demo',
      message: 'SMTP is not configured. Using demo OTP delivery.',
    };
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  await emailTransporter.sendMail({
    from: fromAddress,
    to: recipient,
    subject: 'Your RTI Online verification code',
    text: `Your RTI Online verification code is ${code}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>RTI Online Verification Code</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });

  return {
    sent: true,
    mode: 'live',
    message: 'Email OTP sent successfully',
  };
}

async function sendMobileOtp(recipient) {
  const client = getTwilioClient();
  const to = buildE164IndianNumber(recipient);

  if (!client) {
    return {
      sent: false,
      mode: 'demo',
      message: 'Twilio Verify is not configured. Using demo OTP delivery.',
      to,
    };
  }

  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to,
      channel: 'sms',
    });

  return {
    sent: true,
    mode: 'live',
    message: 'Mobile OTP sent successfully',
    sid: verification.sid,
    status: verification.status,
    to,
  };
}

async function verifyMobileOtp(recipient, code) {
  const client = getTwilioClient();
  const to = buildE164IndianNumber(recipient);

  if (!client) {
    return {
      valid: false,
      mode: 'demo',
      message: 'Twilio Verify is not configured.',
      to,
    };
  }

  const result = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to,
      code,
    });

  return {
    valid: result.status === 'approved',
    status: result.status,
    to,
  };
}

module.exports = {
  sendEmailOtp,
  sendMobileOtp,
  verifyMobileOtp,
  buildE164IndianNumber,
};
