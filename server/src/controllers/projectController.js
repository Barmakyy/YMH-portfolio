import Project from '../models/Project.js';
import slugify from 'slugify';

// GET /api/projects (public — published only)
export const getPublicProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'published' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-body');
    res.status(200).json({ status: 'success', results: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug (public)
export const getPublicProject = async (req, res, next) => {
  try {
    const filter = { slug: req.params.slug };
    if (req.query.preview !== 'true') filter.status = 'published';

    const project = await Project.findOne(filter);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    // Increment views
    project.views += 1;
    await project.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/projects (all)
export const getAllProjects = async (req, res, next) => {
  try {
    const { status, search, sort = 'sortOrder' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter).sort(sort).select('-body');
    res.status(200).json({ status: 'success', results: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/projects/:id
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/projects
export const createProject = async (req, res, next) => {
  try {
    // Generate unique slug
    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug, { lower: true, strict: true });
    }
    const project = await Project.create(req.body);
    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug, { lower: true, strict: true });
    }
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/projects/reorder
export const reorderProjects = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    const updates = orderedIds.map((id, index) =>
      Project.findByIdAndUpdate(id, { sortOrder: index })
    );
    await Promise.all(updates);
    res.status(200).json({ status: 'success', message: 'Projects reordered.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/projects/bulk
export const bulkDeleteProjects = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Project.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ status: 'success', message: `${ids.length} projects deleted.` });
  } catch (error) {
    next(error);
  }
};
