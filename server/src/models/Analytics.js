import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['project_view', 'blog_view', 'link_click', 'download', 'page_view', 'click', 'custom'],
      required: true,
    },
    page: { type: String, required: true }, // URL path
    title: String, // Page title
    referrer: String, // Referrer URL
    viewTime: { type: Number, default: 0 }, // Time spent in seconds
    userAgent: String,
    ipHash: String, // Anonymized IP hash
    sessionId: String, // To group events by session
    metadata: mongoose.Schema.Types.Mixed, // Custom event data
  },
  { timestamps: true }
);

// Index for efficient querying
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ eventType: 1, createdAt: -1 });
analyticsSchema.index({ sessionId: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
