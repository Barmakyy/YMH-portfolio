import { Router } from 'express';
import {
  getPublicSettings,
  getSettings,
  updateSettings,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/public', getPublicSettings);

// Admin routes (protected)
router.use(protect);
router.get('/', getSettings);
router.patch('/', updateSettings);
router.post('/testimonials', addTestimonial);
router.patch('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

export default router;
