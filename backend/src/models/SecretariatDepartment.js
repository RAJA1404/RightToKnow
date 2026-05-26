const mongoose = require('mongoose');

const SecretariatDepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'secretariat_departments',
  }
);

module.exports = mongoose.model('SecretariatDepartment', SecretariatDepartmentSchema);
