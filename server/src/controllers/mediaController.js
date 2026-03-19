import Media from '../models/Media.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET /api/admin/media
export const getAllMedia = async (req, res, next) => {
  try {
    const { search, type, sort = '-createdAt' } = req.query;
    const filter = {};
    if (type) filter.fileType = type;
    if (search) filter.filename = { $regex: search, $options: 'i' };

    const media = await Media.find(filter).sort(sort);
    res.status(200).json({ status: 'success', results: media.length, data: media });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/media/:id
export const getMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found.' });
    res.status(200).json({ status: 'success', data: media });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/media/upload
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (!req.file.buffer) {
      return res.status(400).json({ message: 'File buffer is empty.' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomStr}-${req.file.originalname}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to server
    fs.writeFileSync(filepath, req.file.buffer);

    // Determine file type
    const mimeType = req.file.mimetype;
    const isImage = mimeType.startsWith('image/');
    
    // Create media record
    const media = await Media.create({
      filename: req.file.originalname,
      url: `/uploads/${filename}`, // Local URL instead of Cloudinary
      publicId: filename, // Store filename as publicId for deletion
      fileType: isImage ? 'image' : 'file',
      size: req.file.size,
      width: 0,
      height: 0,
      format: path.extname(req.file.originalname).slice(1),
      altText: req.body.altText || '',
    });

    res.status(201).json({ status: 'success', data: media });
  } catch (error) {
    console.error('Media upload error:', error);
    next(error);
  }
};

// POST /api/admin/media/upload-multiple
export const uploadMultipleMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const mediaItems = [];

    for (const file of req.files) {
      if (!file.buffer) {
        console.error('File buffer is empty:', file.originalname);
        continue;
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const filename = `${timestamp}-${randomStr}-${file.originalname}`;
        const filepath = path.join(uploadsDir, filename);

        // Save file to server
        fs.writeFileSync(filepath, file.buffer);

        // Determine file type
        const mimeType = file.mimetype;
        const isImage = mimeType.startsWith('image/');

        // Create media record
        const media = await Media.create({
          filename: file.originalname,
          url: `/uploads/${filename}`,
          publicId: filename,
          fileType: isImage ? 'image' : 'file',
          size: file.size,
          width: 0,
          height: 0,
          format: path.extname(file.originalname).slice(1),
        });

        mediaItems.push(media);
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
      }
    }

    if (mediaItems.length === 0) {
      return res.status(400).json({ message: 'No files were successfully uploaded.' });
    }

    res.status(201).json({ status: 'success', results: mediaItems.length, data: mediaItems });
  } catch (error) {
    console.error('Media upload error:', error);
    next(error);
  }
};

// PATCH /api/admin/media/:id
export const updateMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { altText: req.body.altText },
      { new: true }
    );
    if (!media) return res.status(404).json({ message: 'Media not found.' });
    res.status(200).json({ status: 'success', data: media });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/media/:id
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found.' });

    // Delete from local file system
    const filepath = path.join(uploadsDir, media.publicId);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};
