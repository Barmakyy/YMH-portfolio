import mongoose from 'mongoose';

const skillCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    skills: [
      {
        name: { type: String, required: true, trim: true },
        icon: { type: String, default: '' },
        customIcon: { type: String, default: '' },
        proficiency: { type: String, enum: ['Expert', 'Proficient', 'Familiar', 'Learning'], default: 'Familiar' },
        featured: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

skillCategorySchema.index({ sortOrder: 1 });

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
export default SkillCategory;
