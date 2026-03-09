import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProject,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  bulkDeleteProjects,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/public', getPublicProjects);
router.get('/public/:slug', getPublicProject);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllProjects);
router.post('/', createProject);
router.patch('/reorder', reorderProjects);
router.delete('/bulk', bulkDeleteProjects);
router.get('/:id', getProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
