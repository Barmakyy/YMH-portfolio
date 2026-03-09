import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check cookie first, then Authorization header
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.', expired: true });
    }
    return res.status(401).json({ message: 'Invalid token. Please log in.' });
  }
};

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
};

export const sendTokenResponse = (admin, statusCode, res, rememberMe = false) => {
  const token = signToken(admin._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (rememberMe ? 30 : parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 8) * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  const adminObj = admin.toObject();
  delete adminObj.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { admin: adminObj },
  });
};
