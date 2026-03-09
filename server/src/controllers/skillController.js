import SkillCategory from '../models/SkillCategory.js';

// GET /api/skills (public)
export const getPublicSkills = async (req, res, next) => {
  try {
    const categories = await SkillCategory.find().sort({ sortOrder: 1 });
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/skills
export const getAllSkills = async (req, res, next) => {
  try {
    const categories = await SkillCategory.find().sort({ sortOrder: 1 });
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/skills/categories
export const createCategory = async (req, res, next) => {
  try {
    const count = await SkillCategory.countDocuments();
    const category = await SkillCategory.create({ ...req.body, sortOrder: count });
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/skills/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await SkillCategory.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/skills/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await SkillCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/skills/categories/:id/skills
export const addSkill = async (req, res, next) => {
  try {
    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    const skillData = { ...req.body, sortOrder: category.skills.length };
    category.skills.push(skillData);
    await category.save();

    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/skills/categories/:categoryId/skills/:skillId
export const updateSkill = async (req, res, next) => {
  try {
    const category = await SkillCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    const skill = category.skills.id(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found.' });

    Object.assign(skill, req.body);
    await category.save();

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/skills/categories/:categoryId/skills/:skillId
export const deleteSkill = async (req, res, next) => {
  try {
    const category = await SkillCategory.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    category.skills.pull({ _id: req.params.skillId });
    await category.save();

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/skills/reorder
export const reorderCategories = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    const updates = orderedIds.map((id, index) =>
      SkillCategory.findByIdAndUpdate(id, { sortOrder: index })
    );
    await Promise.all(updates);
    res.status(200).json({ status: 'success', message: 'Categories reordered.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/skills/categories/:id/reorder-skills
export const reorderSkills = async (req, res, next) => {
  try {
    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    const { orderedIds } = req.body;
    const reordered = orderedIds.map((id, index) => {
      const skill = category.skills.id(id);
      if (skill) skill.sortOrder = index;
      return skill;
    }).filter(Boolean);

    category.skills = reordered;
    await category.save();

    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};
