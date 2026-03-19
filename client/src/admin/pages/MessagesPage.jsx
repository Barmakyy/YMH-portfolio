import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail, FiTrash2, FiCheck, FiCircle, FiExternalLink,
  FiSearch, FiArchive, FiAlertTriangle,
} from 'react-icons/fi';
import api from '../api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchMessages = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/messages', { params });
      setMessages(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, [statusFilter]);

  const selectMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === 'new') {
      await api.patch(`/messages/${msg._id}`, { status: 'read' });
      setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, status: 'read' } : m));
    }
  };

  const markAsReplied = async (id) => {
    await api.patch(`/messages/${id}`, { status: 'replied' });
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status: 'replied' } : m));
    setSelected((prev) => prev ? { ...prev, status: 'replied' } : null);
  };

  const handleBulkRead = async () => {
    if (selectedIds.length === 0) return;
    await api.post('/messages/bulk-update', { ids: selectedIds, status: 'read' });
    setSelectedIds([]);
    fetchMessages();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await api.delete('/messages/bulk', { data: { ids: selectedIds } });
    setSelectedIds([]);
    setSelected(null);
    fetchMessages();
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    await api.delete(`/messages/${deleteModal}`);
    setMessages((prev) => prev.filter((m) => m._id !== deleteModal));
    if (selected?._id === deleteModal) setSelected(null);
    setDeleteModal(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const statusColor = (status) => {
    const c = { new: 'text-blue-500', read: 'text-gray-400', replied: 'text-green-500', archived: 'text-gray-300' };
    return c[status] || 'text-gray-400';
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Messages</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <>
              <button onClick={handleBulkRead} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Mark Read</button>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 text-xs rounded-lg text-red-500 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete ({selectedIds.length})</button>
            </>
          )}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs outline-none">
            <option value="">All</option>
            <option value="new">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[400px] lg:min-h-[500px]">
        {/* Message List */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {messages.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-400">No messages</p></div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => selectMessage(msg)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${
                    selected?._id === msg._id ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                  }`}
                >
                  <input type="checkbox" checked={selectedIds.includes(msg._id)}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(msg._id); }}
                    className="mt-1 w-4 h-4 rounded text-amber-500" />
                  <FiCircle className={`w-2.5 h-2.5 mt-2 flex-shrink-0 ${statusColor(msg.status)}`}
                    fill={msg.status === 'new' ? 'currentColor' : 'none'} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className={`text-sm truncate ${msg.status === 'new' ? 'font-bold' : 'font-medium'}`}>{msg.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{msg.subject || 'No subject'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="hidden lg:block flex-1">
          {selected ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 sticky top-24">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-black font-bold">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  selected.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  selected.status === 'replied' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{selected.status}</span>
              </div>
              {selected.subject && <p className="text-sm font-medium">{selected.subject}</p>}
              <div className="text-xs text-gray-400 flex gap-4 flex-wrap">
                <span>{new Date(selected.createdAt).toLocaleString()}</span>
                {selected.budget && <span>Budget: {selected.budget}</span>}
                {selected.source && <span>Source: {selected.source}</span>}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600">
                  <FiExternalLink className="w-4 h-4" /> Reply via Email
                </a>
                <button onClick={() => markAsReplied(selected._id)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <FiCheck className="w-4 h-4 inline mr-1" /> Mark Replied
                </button>
                <button onClick={() => setDeleteModal(selected._id)}
                  className="px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FiMail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Select a message to view</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><FiAlertTriangle className="w-5 h-5 text-red-500" /></div>
                <h3 className="text-lg font-bold">Delete Message?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;
