import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const resetPassword = async () => {
  const newPassword = process.argv[2];

  if (!newPassword) {
    console.error('Usage: node src/utils/resetPassword.js <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      console.error('Admin user not found. Run "pnpm seed:admin" first.');
      process.exit(1);
    }

    admin.password = newPassword;
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    console.log('Password reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error.message);
    process.exit(1);
  }
};

resetPassword();
