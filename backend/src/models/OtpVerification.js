const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
      enum: ['email', 'mobile'],
      required: true,
      index: true,
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'otp_verifications',
  }
);

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpVerificationSchema.index({ channel: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
