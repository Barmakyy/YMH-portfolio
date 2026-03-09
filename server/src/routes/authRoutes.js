import { Router } from 'express';
import { login, logout, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

export default router;
