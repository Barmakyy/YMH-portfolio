import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSave, FiSend, FiEye, FiTrash2, FiArrowLeft,
  FiPlus, FiX, FiImage, FiLink,
} from 'react-icons/fi';
import api from '../api';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', slug: '', shortDescription: '', body: '', coverImage: '', coverImageAlt: '',
    demoVideoUrl: '', status: 'draft', featured: false, techStack: [],
    liveUrl: '', githubUrl: '', otherLinks: [], projectType: [],
    teamSize: 1, startDate: '', endDate: '', ongoing: false, clientContext: '',
    metaTitle: '', metaDescription: '', ogImage: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/projects/${id}`).then(({ data }) => {
        const p = data.data;
        setForm({
          ...p,
          startDate: p.startDate ? p.startDate.slice(0, 10) : '',
          endDate: p.endDate ? p.endDate.slice(0, 10) : '',
        });
        setLoading(false);
      }).catch(() => navigate('/admin/projects'));
    }
  }, [id]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!isEdit) {
      const interval = setInterval(() => {
        localStorage.setItem('project-draft', JSON.stringify(form));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [form, isEdit]);

  // Load draft on mount
  useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem('project-draft');
      if (draft) {
        try { setForm(JSON.parse(draft)); } catch {}
      }
    }
  }, []);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.techStack.includes(tag)) {
      updateField('techStack', [...form.techStack, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => updateField('techStack', form.techStack.filter((t) => t !== tag));

  const addOtherLink = () => updateField('otherLinks', [...form.otherLinks, { label: '', url: '' }]);

  const updateOtherLink = (index, field, value) => {
    const links = [...form.otherLinks];
    links[index][field] = value;
    updateField('otherLinks', links);
  };

  const removeOtherLink = (index) => updateField('otherLinks', form.otherLinks.filter((_, i) => i !== index));

  const handleSave = async (status) => {
    setSaving(true);
    try {
      const payload = { ...form, status: status || form.status };
      if (isEdit) {
        await api.patch(`/projects/${id}`, payload);
      } else {
        const { data } = await api.post('/projects', payload);
        localStorage.removeItem('project-draft');
        navigate(`/admin/projects/${data.data._id}/edit`);
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky Save Bar */}
      <div className="sticky top-16 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md -mx-4 px-4 py-3 lg:-mx-6 lg:px-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 inline mr-1.5" /> Save Draft
          </button>
          <button
            onClick={() => handleSave(form.status === 'published' ? 'draft' : 'published')}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <FiSend className="w-4 h-4 inline mr-1.5" />
            {form.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          {isEdit && (
            <button
              onClick={async () => {
                if (confirm('Delete this project?')) {
                  await api.delete(`/projects/${id}`);
                  navigate('/admin/projects');
                }
              }}
              className="px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-black font-semibold">Basic Info</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text" value={form.title}
            onChange={(e) => {
              updateField('title', e.target.value);
              if (!isEdit) updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text" value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="project-slug"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description <span className="text-gray-400">({form.shortDescription.length}/300)</span></label>
          <textarea
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value.slice(0, 300))}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            placeholder="Brief description..."
          />
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input
              type="checkbox" checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </section>

      {/* Cover Media */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Cover Media</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            type="url" value={form.coverImage}
            onChange={(e) => updateField('coverImage', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="https://..."
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="" className="mt-3 max-h-48 rounded-lg object-cover" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image Alt Text</label>
          <input
            type="text" value={form.coverImageAlt}
            onChange={(e) => updateField('coverImageAlt', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Demo Video URL</label>
          <input
            type="url" value={form.demoVideoUrl}
            onChange={(e) => updateField('demoVideoUrl', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="YouTube or Loom URL"
          />
        </div>
      </section>

      {/* Project Body */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Project Details</h2>
        <textarea
          value={form.body}
          onChange={(e) => updateField('body', e.target.value)}
          rows={15}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-y font-mono"
          placeholder="Write project details here... (Rich text editor coming soon)"
        />
      </section>

      {/* Tech Stack */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Tech Stack</h2>
        <div className="flex gap-2">
          <input
            type="text" value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Add technology..."
          />
          <button onClick={addTag} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techStack.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
              {tag}
              <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Live Demo URL</label>
            <input type="url" value={form.liveUrl} onChange={(e) => updateField('liveUrl', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input type="url" value={form.githubUrl} onChange={(e) => updateField('githubUrl', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Other Links</label>
            <button onClick={addOtherLink} className="text-amber-500 text-sm hover:underline flex items-center gap-1">
              <FiPlus className="w-3 h-3" /> Add Link
            </button>
          </div>
          {form.otherLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" value={link.label} onChange={(e) => updateOtherLink(i, 'label', e.target.value)}
                placeholder="Label" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
              <input type="url" value={link.url} onChange={(e) => updateOtherLink(i, 'url', e.target.value)}
                placeholder="URL" className="flex-[2] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
              <button onClick={() => removeOtherLink(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Metadata */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Project Metadata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Size</label>
            <input type="number" min="1" value={form.teamSize} onChange={(e) => updateField('teamSize', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client / Context</label>
            <input type="text" value={form.clientContext} onChange={(e) => updateField('clientContext', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="e.g. Freelance — retail industry" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => updateField('startDate', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <div className="flex items-center gap-3">
              <input type="date" value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)}
                disabled={form.ongoing}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50" />
              <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                <input type="checkbox" checked={form.ongoing} onChange={(e) => updateField('ongoing', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500" /> Ongoing
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input type="text" value={form.metaTitle || form.title} onChange={(e) => updateField('metaTitle', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea value={form.metaDescription || form.shortDescription} onChange={(e) => updateField('metaDescription', e.target.value)}
            rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
        </div>
      </section>
    </div>
  );
};

export default ProjectFormPage;
