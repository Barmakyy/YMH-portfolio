import Settings from '../models/Settings.js';

// Helper: get or create singleton settings
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// GET /api/settings (public — limited fields)
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    const publicData = {
      fullName: settings.fullName,
      jobTitle: settings.jobTitle,
      bio: settings.bio,
      profilePhoto: settings.profilePhoto,
      accentColor: settings.accentColor,
      defaultColorMode: settings.defaultColorMode,
      availabilityStatus: settings.availabilityStatus,
      availabilityNote: settings.availabilityNote,
      resumeUrl: settings.resumeUrl,
      testimonials: settings.testimonials.filter((t) => t.display),
      githubUsername: settings.githubUsername,
      calendlyUrl: settings.calendlyUrl,
    };
    res.status(200).json({ status: 'success', data: publicData });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/settings
export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/settings
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/settings/testimonials
export const addTestimonial = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    settings.testimonials.push(req.body);
    await settings.save();
    res.status(201).json({ status: 'success', data: settings.testimonials });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/settings/testimonials/:id
export const updateTestimonial = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    const testimonial = settings.testimonials.id(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });

    Object.assign(testimonial, req.body);
    await settings.save();
    res.status(200).json({ status: 'success', data: settings.testimonials });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/settings/testimonials/:id
export const deleteTestimonial = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    settings.testimonials.pull({ _id: req.params.id });
    await settings.save();
    res.status(200).json({ status: 'success', data: settings.testimonials });
  } catch (error) {
    next(error);
  }
};
