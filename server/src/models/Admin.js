import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    avatar: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    timezone: { type: String, default: '' },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before save
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
adminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts
adminSchema.methods.incrementLoginAttempts = async function () {
  const maxAttempts = parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5;
  const lockTime = parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 900000;

  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= maxAttempts) {
      this.lockUntil = new Date(Date.now() + lockTime);
    }
  }
  await this.save();
};

// Reset login attempts on successful login
adminSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
