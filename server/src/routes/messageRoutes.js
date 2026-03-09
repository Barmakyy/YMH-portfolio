import { Router } from 'express';
import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  bulkUpdateMessages,
  bulkDeleteMessages,
  getUnreadCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public route (contact form submission)
router.post('/', createMessage);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllMessages);
router.get('/unread-count', getUnreadCount);
router.post('/bulk-update', bulkUpdateMessages);
router.delete('/bulk', bulkDeleteMessages);
router.get('/:id', getMessage);
router.patch('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
