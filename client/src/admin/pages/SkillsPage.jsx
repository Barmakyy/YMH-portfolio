import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiChevronDown, FiChevronRight, FiStar } from 'react-icons/fi';
import api from '../api';

const SkillsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [newCatName, setNewCatName] = useState('');
  const [editCat, setEditCat] = useState(null);
  const [skillModal, setSkillModal] = useState(null); // { categoryId, skill? }

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setCategories(data.data);
      const exp = {};
      data.data.forEach((c) => (exp[c._id] = true));
      setExpanded(exp);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await api.post('/skills/categories', { name: newCatName.trim() });
      setNewCatName('');
      fetchSkills();
    } catch (err) { console.error(err); }
  };

  const updateCategoryName = async () => {
    if (!editCat) return;
    try {
      await api.patch(`/skills/categories/${editCat._id}`, { name: editCat.name });
      setEditCat(null);
      fetchSkills();
    } catch (err) { console.error(err); }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category and all its skills?')) return;
    try { await api.delete(`/skills/categories/${id}`); fetchSkills(); }
    catch (err) { console.error(err); }
  };

  const saveSkill = async (formData) => {
    try {
      if (formData._id) {
        await api.patch(`/skills/categories/${skillModal.categoryId}/skills/${formData._id}`, formData);
      } else {
        await api.post(`/skills/categories/${skillModal.categoryId}/skills`, formData);
      }
      setSkillModal(null);
      fetchSkills();
    } catch (err) { console.error(err); }
  };

  const deleteSkill = async (catId, skillId) => {
    if (!confirm('Delete this skill?')) return;
    try { await api.delete(`/skills/categories/${catId}/skills/${skillId}`); fetchSkills(); }
    catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Skills Manager</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage skill categories and individual skills</p>
      </div>

      {/* Add Category */}
      <div className="flex gap-2">
        <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()} placeholder="New category name..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        <button onClick={addCategory} className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
          <FiPlus className="w-4 h-4 inline mr-1" /> Add Category
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
              onClick={() => setExpanded((prev) => ({ ...prev, [cat._id]: !prev[cat._id] }))}>
              <div className="flex items-center gap-3">
                {expanded[cat._id] ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                <h3 className="font-semibold">{cat.name}</h3>
                <span className="text-xs text-gray-400">{cat.skills.length} skills</span>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditCat({ _id: cat._id, name: cat.name })} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => setSkillModal({ categoryId: cat._id })} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500"><FiPlus className="w-4 h-4" /></button>
                <button onClick={() => deleteCategory(cat._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <AnimatePresence>
              {expanded[cat._id] && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                    {cat.skills.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-gray-400 text-center">No skills yet. Click + to add one.</p>
                    ) : cat.skills.map((skill) => (
                      <div key={skill._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs capitalize">{skill.proficiency}</span>
                          {skill.featured && <FiStar className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSkillModal({ categoryId: cat._id, skill })} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><FiEdit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteSkill(cat._id, skill._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl w-full">
              <h3 className="text-lg font-bold mb-4">Edit Category</h3>
              <input type="text" value={editCat.name} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm mb-4 outline-none" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditCat(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
                <button onClick={updateCategoryName} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Skill Modal */}
      <AnimatePresence>
        {skillModal && <SkillFormModal data={skillModal} onSave={saveSkill} onClose={() => setSkillModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

const SkillFormModal = ({ data, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '', icon: '', proficiency: 'Familiar', featured: false,
    ...data.skill,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-xl w-full space-y-4">
        <h3 className="text-lg font-bold">{data.skill ? 'Edit Skill' : 'Add Skill'}</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Icon (class name)</label>
          <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" placeholder="e.g. SiReact" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Proficiency</label>
          <select value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none">
            <option>Expert</option><option>Proficient</option><option>Familiar</option><option>Learning</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded text-amber-500" />
          <span className="text-sm">Featured (show on home page)</span>
        </label>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsPage;
