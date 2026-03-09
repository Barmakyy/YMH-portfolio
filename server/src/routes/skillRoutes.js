import { Router } from 'express';
import {
  getPublicSkills,
  getAllSkills,
  createCategory,
  updateCategory,
  deleteCategory,
  addSkill,
  updateSkill,
  deleteSkill,
  reorderCategories,
  reorderSkills,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/public', getPublicSkills);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllSkills);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/:id/skills', addSkill);
router.patch('/categories/:categoryId/skills/:skillId', updateSkill);
router.delete('/categories/:categoryId/skills/:skillId', deleteSkill);
router.patch('/reorder', reorderCategories);
router.patch('/categories/:id/reorder-skills', reorderSkills);

export default router;
