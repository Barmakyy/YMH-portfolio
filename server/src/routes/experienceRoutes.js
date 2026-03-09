import { Router } from 'express';
import {
  getPublicExperience,
  getAllExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/experienceController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/public', getPublicExperience);

// Admin routes (protected)
router.use(protect);
router.get('/', getAllExperience);
router.post('/', createExperience);
router.patch('/reorder', reorderExperience);
router.patch('/:id', updateExperience);
router.delete('/:id', deleteExperience);

// Certifications
router.post('/certifications', createCertification);
router.patch('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

export default router;
