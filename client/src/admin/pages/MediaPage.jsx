import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiSearch, FiTrash2, FiCopy, FiCheck, FiImage, FiX } from 'react-icons/fi';
import api from '../api';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const fetchMedia = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      const { data } = await api.get('/media', { params });
      setMedia(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMedia(); }, []);
  useEffect(() => { const t = setTimeout(fetchMedia, 300); return () => clearTimeout(t); }, [search]);

  const handleUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      if (files.length === 1) {
        formData.append('file', files[0]);
        await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        for (const file of files) formData.append('files', file);
        await api.post('/media/upload-multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      fetchMedia();
    } catch (err) { console.error(err); alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleUpload(Array.from(e.dataTransfer.files));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file? It will also be removed from Cloudinary.')) return;
    try {
      await api.delete(`/media/${id}`);
      setMedia((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const updateAltText = async (id, altText) => {
    try {
      await api.patch(`/media/${id}`, { altText });
      setMedia((prev) => prev.map((m) => (m._id === id ? { ...m, altText } : m)));
      if (selected?._id === id) setSelected({ ...selected, altText });
    } catch (err) { console.error(err); }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <button onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
          <FiUpload className="w-4 h-4" /> Upload
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.svg" className="hidden"
          onChange={(e) => handleUpload(Array.from(e.target.files))} />
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-amber-400 transition-colors"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto" />
        ) : (
          <>
            <FiImage className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drag & drop files here, or click Upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, SVG, GIF, PDF · Max 10MB</p>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>

      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>
          ) : media.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-400">No media files yet</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {media.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors aspect-square ${
                    selected?._id === item._id ? 'border-amber-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {item.fileType === 'image' ? (
                    <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xs text-gray-400 uppercase">{item.format}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 truncate w-full">{item.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 hidden lg:block sticky top-24 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Details</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><FiX className="w-4 h-4" /></button>
              </div>
              {selected.fileType === 'image' ? (
                <img src={selected.url} alt="" className="w-full rounded-lg" />
              ) : (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"><span className="text-gray-400 uppercase">{selected.format}</span></div>
              )}
              <div className="space-y-2 text-xs">
                <p><span className="text-gray-400">Filename:</span> {selected.filename}</p>
                {selected.width > 0 && <p><span className="text-gray-400">Dimensions:</span> {selected.width}×{selected.height}</p>}
                <p><span className="text-gray-400">Size:</span> {formatSize(selected.size)}</p>
                <p><span className="text-gray-400">Uploaded:</span> {new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Alt Text</label>
                <input type="text" value={selected.altText}
                  onChange={(e) => { setSelected({ ...selected, altText: e.target.value }); }}
                  onBlur={(e) => updateAltText(selected._id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs outline-none" />
              </div>
              <button onClick={() => copyUrl(selected.url)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                {copied ? <><FiCheck className="w-3 h-3 text-green-500" /> Copied!</> : <><FiCopy className="w-3 h-3" /> Copy URL</>}
              </button>
              <button onClick={() => handleDelete(selected._id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <FiTrash2 className="w-3 h-3" /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MediaPage;
