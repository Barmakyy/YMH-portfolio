import Admin from '../models/Admin.js';
import { sendTokenResponse } from '../middleware/auth.js';

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // Reset login attempts on success
    await admin.resetLoginAttempts();

    sendTokenResponse(admin, 200, res, rememberMe);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    res.status(200).json({ status: 'success', data: { admin } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/auth/update-password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    const isCorrect = await admin.comparePassword(currentPassword);

    if (!isCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    admin.password = newPassword;
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};
