import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['work', 'education'], required: true },
    // Work fields
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', ''], default: '' },
    // Education fields
    institution: { type: String, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    relevantCoursework: [{ type: String, trim: true }],
    // Shared fields
    startDate: { type: Date },
    endDate: { type: Date },
    present: { type: Boolean, default: false },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String, trim: true }],
    logo: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ type: 1, sortOrder: 1 });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
