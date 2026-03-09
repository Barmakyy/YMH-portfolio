import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
