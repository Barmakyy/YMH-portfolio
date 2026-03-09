import Experience from '../models/Experience.js';
import Certification from '../models/Certification.js';

// GET /api/experience (public)
export const getPublicExperience = async (req, res, next) => {
  try {
    const work = await Experience.find({ type: 'work' }).sort({ sortOrder: 1 });
    const education = await Experience.find({ type: 'education' }).sort({ sortOrder: 1 });
    const certifications = await Certification.find().sort({ sortOrder: 1 });
    res.status(200).json({ status: 'success', data: { work, education, certifications } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/experience
export const getAllExperience = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const entries = await Experience.find(filter).sort({ sortOrder: 1 });
    const certifications = await Certification.find().sort({ sortOrder: 1 });
    res.status(200).json({ status: 'success', data: { entries, certifications } });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/experience
export const createExperience = async (req, res, next) => {
  try {
    const count = await Experience.countDocuments({ type: req.body.type });
    const entry = await Experience.create({ ...req.body, sortOrder: count });
    res.status(201).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/experience/:id
export const updateExperience = async (req, res, next) => {
  try {
    const entry = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    res.status(200).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/experience/:id
export const deleteExperience = async (req, res, next) => {
  try {
    const entry = await Experience.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/experience/reorder
export const reorderExperience = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    const updates = orderedIds.map((id, index) =>
      Experience.findByIdAndUpdate(id, { sortOrder: index })
    );
    await Promise.all(updates);
    res.status(200).json({ status: 'success', message: 'Experience reordered.' });
  } catch (error) {
    next(error);
  }
};

// --- Certifications ---

// POST /api/admin/certifications
export const createCertification = async (req, res, next) => {
  try {
    const count = await Certification.countDocuments();
    const cert = await Certification.create({ ...req.body, sortOrder: count });
    res.status(201).json({ status: 'success', data: cert });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/certifications/:id
export const updateCertification = async (req, res, next) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cert) return res.status(404).json({ message: 'Certification not found.' });
    res.status(200).json({ status: 'success', data: cert });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/certifications/:id
export const deleteCertification = async (req, res, next) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certification not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};
