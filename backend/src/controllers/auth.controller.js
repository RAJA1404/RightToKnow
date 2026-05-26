const User = require('../models/User');
const OtpVerification = require('../models/OtpVerification');
const jwt = require('jsonwebtoken');
const { verifyDjangoHash } = require('../utils/legacyAuth');
const { sendEmailOtp, sendMobileOtp, verifyMobileOtp } = require('../services/otp.service');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

const OTP_TTL_MINUTES = 10;

function normalizeRecipient(channel, value) {
  const rawValue = String(value || '').trim();

  if (channel === 'email') {
    return rawValue.toLowerCase();
  }

  return rawValue.replace(/\D/g, '');
}

function isValidRecipient(channel, recipient) {
  if (channel === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
  }

  return /^\d{10}$/.test(recipient);
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, first_name, last_name, phone, address, aadhaar_no } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({
      email,
      password,
      firstName: firstName || first_name,
      lastName: lastName || last_name,
      phone,
      address,
      aadhaarNo: aadhaar_no,
      role: 'citizen',
    });

    const access = generateToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        address: user.address,
        aadhaar_no: user.aadhaarNo,
      },
      tokens: {
        access,
        refresh: access,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    let isMatch = false;

    // Support for Legacy Django Hashes
    if (user.password.startsWith('pbkdf2_sha256$')) {
      isMatch = verifyDjangoHash(password, user.password);
      
      // Upgrade to bcrypt on success
      if (isMatch) {
          user.password = password; // Pre-save hook will handle bcrypt
          await user.save();
          console.log(`[AUTH] Seamlessly upgraded legacy password for: ${user.email}`);
      }
    } else {
      isMatch = await user.matchPassword(password);
    }

    if (isMatch) {
      const access = generateToken(user._id);
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          address: user.address,
          aadhaar_no: user.aadhaarNo,
          department_name: user.departmentName || null,
        },
        tokens: {
          access,
          refresh: access,
        },
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.requestOtp = async (req, res) => {
  try {
    const { channel, recipient } = req.body;
    const normalizedChannel = String(channel || '').trim().toLowerCase();
    const normalizedRecipient = normalizeRecipient(normalizedChannel, recipient);

    if (!['email', 'mobile'].includes(normalizedChannel)) {
      return res.status(400).json({ error: 'Valid OTP channel is required' });
    }

    if (!isValidRecipient(normalizedChannel, normalizedRecipient)) {
      return res.status(400).json({
        error: normalizedChannel === 'email' ? 'Enter a valid email address' : 'Enter a valid 10-digit mobile number',
      });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    let deliveryResult;

    if (normalizedChannel === 'email') {
      await OtpVerification.findOneAndUpdate(
        { channel: normalizedChannel, recipient: normalizedRecipient },
        {
          $set: {
            code,
            expiresAt,
            verifiedAt: null,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      deliveryResult = await sendEmailOtp(normalizedRecipient, code);
    } else {
      deliveryResult = await sendMobileOtp(normalizedRecipient);

      if (deliveryResult.mode === 'demo') {
        await OtpVerification.findOneAndUpdate(
          { channel: normalizedChannel, recipient: normalizedRecipient },
          {
            $set: {
              code,
              expiresAt,
              verifiedAt: null,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else {
        await OtpVerification.deleteOne({
          channel: normalizedChannel,
          recipient: normalizedRecipient,
        });
      }
    }

    const response = {
      success: true,
      message: deliveryResult.message,
      expiresAt,
      deliveryMode: deliveryResult.mode,
    };

    if (deliveryResult.mode === 'demo') {
      response.demoOtp = code;
      response.message =
        normalizedChannel === 'email'
          ? 'Email OTP is in demo mode. Configure SMTP for real delivery.'
          : 'Mobile OTP is in demo mode. Configure Twilio Verify for real delivery.';
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { channel, recipient, otp } = req.body;
    const normalizedChannel = String(channel || '').trim().toLowerCase();
    const normalizedRecipient = normalizeRecipient(normalizedChannel, recipient);
    const normalizedOtp = String(otp || '').trim();

    if (!['email', 'mobile'].includes(normalizedChannel)) {
      return res.status(400).json({ error: 'Valid OTP channel is required' });
    }

    if (!normalizedOtp || !/^\d{6}$/.test(normalizedOtp)) {
      return res.status(400).json({ error: 'Enter a valid 6-digit OTP' });
    }

    let verifiedAt = new Date();

    if (normalizedChannel === 'mobile' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID) {
      const result = await verifyMobileOtp(normalizedRecipient, normalizedOtp);

      if (!result.valid) {
        return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
      }
    } else {
      const record = await OtpVerification.findOne({
        channel: normalizedChannel,
        recipient: normalizedRecipient,
      });

      if (!record) {
        return res.status(404).json({ error: 'OTP not found. Please request a new OTP.' });
      }

      if (record.expiresAt.getTime() < Date.now()) {
        return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
      }

      if (record.code !== normalizedOtp) {
        return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
      }

      record.verifiedAt = new Date();
      await record.save();
      verifiedAt = record.verifiedAt;
    }

    return res.json({
      success: true,
      message:
        normalizedChannel === 'email'
          ? 'Email verified successfully'
          : 'Mobile number verified successfully',
      verifiedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
};
