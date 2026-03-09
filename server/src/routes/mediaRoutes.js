import { Router } from 'express';
import multer from 'multer';
import {
  getAllMedia,
  getMedia,
  uploadMedia,
  uploadMultipleMedia,
  updateMedia,
  deleteMedia,
  getCloudinarySignature,
} from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed.'), false);
    }
  },
});

const router = Router();

// All media routes are protected
router.use(protect);
router.get('/', getAllMedia);
router.get('/cloudinary-signature', getCloudinarySignature);
router.get('/:id', getMedia);
router.post('/upload', upload.single('file'), uploadMedia);
router.post('/upload-multiple', upload.array('files', 20), uploadMultipleMedia);
router.patch('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;
