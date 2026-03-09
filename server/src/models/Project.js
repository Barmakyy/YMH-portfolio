import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, maxlength: 300, default: '' },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverImageAlt: { type: String, default: '' },
    demoVideoUrl: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    featured: { type: Boolean, default: false },
    techStack: [{ type: String, trim: true }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    otherLinks: [{ label: String, url: String }],
    projectType: [{ type: String, enum: ['Full-Stack App', 'REST API', 'Frontend', 'Open Source', 'Freelance', 'Personal'] }],
    teamSize: { type: Number, default: 1 },
    startDate: { type: Date },
    endDate: { type: Date },
    ongoing: { type: Boolean, default: false },
    clientContext: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    // SEO
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
projectSchema.pre('validate', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

projectSchema.index({ status: 1, sortOrder: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
