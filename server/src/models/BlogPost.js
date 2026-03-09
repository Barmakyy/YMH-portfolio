import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, maxlength: 200, default: '' },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    publishDate: { type: Date },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    readTime: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    // SEO
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Calculate read time & word count from body
  if (this.isModified('body') && this.body) {
    const plainText = this.body.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/).filter(Boolean).length;
    this.wordCount = words;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
});

blogPostSchema.index({ status: 1, publishDate: -1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
