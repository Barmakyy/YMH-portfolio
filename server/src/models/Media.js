import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, default: 'image' },
    size: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    altText: { type: String, default: '' },
    format: { type: String, default: '' },
  },
  { timestamps: true }
);

mediaSchema.index({ filename: 'text' });
mediaSchema.index({ fileType: 1, createdAt: -1 });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
