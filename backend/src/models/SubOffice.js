const mongoose = require('mongoose');

const SubOfficeSchema = new mongoose.Schema(
  {
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hod',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    hasSubOffices: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'sub_offices',
  }
);

module.exports = mongoose.model('SubOffice', SubOfficeSchema);
