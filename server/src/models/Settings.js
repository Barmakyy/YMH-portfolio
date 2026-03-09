import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // Profile
    fullName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    location: { type: String, default: '' },
    timezone: { type: String, default: '' },
    // Appearance
    accentColor: { type: String, default: '#f59e0b' },
    defaultColorMode: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    favicon: { type: String, default: '' },
    ogDefaultImage: { type: String, default: '' },
    footerText: { type: String, default: '' },
    // Resume
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    // Availability
    availabilityStatus: {
      type: String,
      enum: ['Open to Opportunities', 'Selectively Looking', 'Not Available'],
      default: 'Open to Opportunities',
    },
    availabilityNote: { type: String, default: '' },
    // Testimonials
    testimonials: [
      {
        quote: { type: String, required: true },
        authorName: { type: String, required: true },
        authorTitle: { type: String, default: '' },
        authorAvatar: { type: String, default: '' },
        display: { type: Boolean, default: true },
      },
    ],
    // Integrations
    googleAnalyticsId: { type: String, default: '' },
    plausibleDomain: { type: String, default: '' },
    githubUsername: { type: String, default: '' },
    calendlyUrl: { type: String, default: '' },
    recaptchaSiteKey: { type: String, default: '' },
    recaptchaSecretKey: { type: String, default: '' },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
