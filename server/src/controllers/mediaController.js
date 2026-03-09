import Media from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';

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

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const media = await Media.create({
      filename: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      fileType: result.resource_type === 'image' ? 'image' : 'file',
      size: result.bytes,
      width: result.width || 0,
      height: result.height || 0,
      format: result.format || '',
      altText: req.body.altText || '',
    });

    res.status(201).json({ status: 'success', data: media });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/media/upload-multiple
export const uploadMultipleMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio', resource_type: 'auto' },
            async (error, result) => {
              if (error) return reject(error);
              const media = await Media.create({
                filename: file.originalname,
                url: result.secure_url,
                publicId: result.public_id,
                fileType: result.resource_type === 'image' ? 'image' : 'file',
                size: result.bytes,
                width: result.width || 0,
                height: result.height || 0,
                format: result.format || '',
              });
              resolve(media);
            }
          );
          uploadStream.end(file.buffer);
        })
    );

    const mediaItems = await Promise.all(uploadPromises);
    res.status(201).json({ status: 'success', results: mediaItems.length, data: mediaItems });
  } catch (error) {
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

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);
    await Media.findByIdAndDelete(req.params.id);

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/media/cloudinary-signature
export const getCloudinarySignature = async (req, res, next) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'portfolio' },
      process.env.CLOUDINARY_API_SECRET
    );
    res.status(200).json({
      status: 'success',
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      },
    });
  } catch (error) {
    next(error);
  }
};
