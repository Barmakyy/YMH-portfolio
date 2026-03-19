import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  trackEvent,
  getAnalyticsSummary,
  getAnalyticsEvents,
  getTopPages,
  deleteAllAnalytics,
} from '../controllers/analyticsController.js';

const router = Router();

// Public routes - tracking
router.post('/track', trackEvent);

// Protected routes - admin only
router.use(protect);
router.get('/summary', getAnalyticsSummary);
router.get('/events', getAnalyticsEvents);
router.get('/pages', getTopPages);
router.delete('/all', deleteAllAnalytics);

export default router;
