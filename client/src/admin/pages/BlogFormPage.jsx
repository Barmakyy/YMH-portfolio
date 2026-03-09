import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiSend, FiTrash2, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import api from '../api';

const BlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', body: '', coverImage: '',
    status: 'draft', publishDate: '', tags: [], featured: false,
    metaTitle: '', metaDescription: '', canonicalUrl: '', ogImage: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/blog/${id}`).then(({ data }) => {
        const p = data.data;
        setForm({ ...p, publishDate: p.publishDate ? new Date(p.publishDate).toISOString().slice(0, 16) : '' });
        setLoading(false);
      }).catch(() => navigate('/admin/blog'));
    }
  }, [id]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField('tags', [...form.tags, tag]);
      setTagInput('');
    }
  };

  const handleSave = async (status) => {
    setSaving(true);
    try {
      const payload = { ...form, status: status || form.status };
      if (status === 'published' && !payload.publishDate) payload.publishDate = new Date().toISOString();
      if (isEdit) {
        await api.patch(`/blog/${id}`, payload);
      } else {
        const { data } = await api.post('/blog', payload);
        navigate(`/admin/blog/${data.data._id}/edit`);
        return;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;

  const wordCount = form.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Save Bar */}
      <div className="sticky top-16 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md -mx-4 px-4 py-3 lg:-mx-6 lg:px-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
        <button onClick={() => navigate('/admin/blog')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">{wordCount} words · {readTime} min read</span>
          <button onClick={() => handleSave('draft')} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <FiSave className="w-4 h-4 inline mr-1.5" /> Save Draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50">
            <FiSend className="w-4 h-4 inline mr-1.5" /> {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
          {isEdit && (
            <button onClick={async () => { if (confirm('Delete this post?')) { await api.delete(`/blog/${id}`); navigate('/admin/blog'); } }}
              className="px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input type="text" value={form.title} onChange={(e) => { updateField('title', e.target.value); if (!isEdit) updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => updateField('slug', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt ({form.excerpt.length}/200)</label>
          <textarea value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value.slice(0, 200))} rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          {form.status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <input type="datetime-local" value={form.publishDate} onChange={(e) => updateField('publishDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-4 h-4 rounded text-amber-500" />
          <span className="text-sm">Featured Post</span>
        </label>
      </section>

      {/* Cover Image */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Cover Image</h2>
        <input type="url" value={form.coverImage} onChange={(e) => updateField('coverImage', e.target.value)} placeholder="https://..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        {form.coverImage && <img src={form.coverImage} alt="" className="max-h-48 rounded-lg object-cover" />}
      </section>

      {/* Tags */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex gap-2">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
          <button onClick={addTag} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"><FiPlus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
              {tag} <button onClick={() => updateField('tags', form.tags.filter((t) => t !== tag))} className="text-gray-400 hover:text-red-500"><FiX className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Post Body</h2>
        <textarea value={form.body} onChange={(e) => updateField('body', e.target.value)} rows={20}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-y font-mono"
          placeholder="Write your post content here..." />
        <div className="flex gap-4 text-xs text-gray-400">
          <span>{wordCount} words</span>
          <span>{readTime} min read</span>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input type="text" value={form.metaTitle || form.title} onChange={(e) => updateField('metaTitle', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea value={form.metaDescription || form.excerpt} onChange={(e) => updateField('metaDescription', e.target.value)} rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Canonical URL</label>
          <input type="url" value={form.canonicalUrl} onChange={(e) => updateField('canonicalUrl', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" placeholder="For cross-posted articles" />
        </div>
      </section>
    </div>
  );
};

export default BlogFormPage;
