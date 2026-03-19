import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCopy, FiStar, FiAlertTriangle } from 'react-icons/fi';
import api from '../api';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/blog', { params });
      setPosts(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, [statusFilter]);
  useEffect(() => { const t = setTimeout(fetchPosts, 300); return () => clearTimeout(t); }, [search]);

  const handleDuplicate = async (id) => {
    try {
      const { data } = await api.post(`/blog/${id}/duplicate`);
      navigate(`/admin/blog/${data.data._id}/edit`);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/blog/${deleteModal}`);
      setPosts((prev) => prev.filter((p) => p._id !== deleteModal));
      setDeleteModal(null);
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const s = { published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', scheduled: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${s[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Blog Posts</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{posts.length} total posts</p>
        </div>
        <Link to="/admin/blog/new" className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors">
          <FiPlus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 font-medium">No posts found</p>
          <Link to="/admin/blog/new" className="text-amber-500 text-sm hover:underline mt-1 inline-block">Write your first post</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">Post</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Tags</th>
                <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500 w-24">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? <img src={post.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />}
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{post.title}</p>
                          <p className="text-xs text-gray-400">{post.readTime} min read</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{statusBadge(post.status)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {post.tags?.slice(0, 3).map((t) => <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/admin/blog/${post._id}/edit`)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDuplicate(post._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Duplicate"><FiCopy className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteModal(post._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><FiAlertTriangle className="w-5 h-5 text-red-500" /></div>
                <h3 className="text-lg font-bold">Delete Post?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogListPage;
