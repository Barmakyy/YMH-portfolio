import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    budget: { type: String, default: '' },
    source: { type: String, default: '' },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
    readAt: { type: Date },
  },
  { timestamps: true }
);

messageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
