const mongoose = require('mongoose');

const HodSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    hodName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => /^\d{6}$/.test(String(value || '')),
        message: 'Pincode must be exactly 6 digits',
      },
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'hods',
  }
);

HodSchema.index({ departmentId: 1, isOnboarded: 1 });

module.exports = mongoose.models.Hod || mongoose.model('Hod', HodSchema);
