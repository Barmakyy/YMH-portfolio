import { Router } from 'express';
import {
  getPublicPosts,
  getPublicPost,
  getAllTags,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  duplicatePost,
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/public', getPublicPosts);
router.get('/public/tags', getAllTags);
router.get('/public/:slug', getPublicPost);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/duplicate', duplicatePost);

export default router;
