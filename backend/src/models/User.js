const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['citizen', 'main_admin', 'dept_admin', 'pio', 'super_admin'],
    default: 'citizen',
    index: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  aadhaarNo: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', index: true },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('pbkdf2_sha256$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
