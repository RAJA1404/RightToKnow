const mongoose = require('mongoose');
const { buildDepartmentCode, buildDepartmentKeywords, normalizeDepartmentName } = require('../utils/departmentKeywords');

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    normalizedName: { type: String, required: true, unique: true, index: true, trim: true },
    description: String,
    code: { type: String, unique: true, sparse: true },
    keywords: {
      type: [String],
      default: [],
    },
    category: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

DepartmentSchema.pre('validate', function setNormalizedFields(next) {
  this.normalizedName = normalizeDepartmentName(this.name);
  this.code = this.code || buildDepartmentCode(this.name);

  if (!this.keywords || this.keywords.length === 0) {
    this.keywords = buildDepartmentKeywords(this.name, this.category);
  } else {
    this.keywords = [...new Set(this.keywords.map((keyword) => String(keyword).trim().toLowerCase()).filter(Boolean))];
  }

  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
