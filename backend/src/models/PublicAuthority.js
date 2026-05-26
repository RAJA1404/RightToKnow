const mongoose = require('mongoose');

const PublicAuthoritySchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true, trim: true },
    normalizedDepartmentName: { type: String, required: true, unique: true, index: true, trim: true },
    publicAuthorities: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      default: 'RTI Public Authorities Workbook',
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'public_authorities',
  }
);

module.exports = mongoose.model('PublicAuthority', PublicAuthoritySchema);
