import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBriefcase, FiBook } from 'react-icons/fi';
import api from '../api';

const ExperiencePage = () => {
  const [tab, setTab] = useState('work');
  const [entries, setEntries] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type, entry? }
  const [certModal, setCertModal] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/experience');
      setEntries(data.data.entries);
      setCertifications(data.data.certifications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = entries.filter((e) => e.type === tab);

  const saveEntry = async (form) => {
    try {
      if (form._id) {
        await api.patch(`/experience/${form._id}`, form);
      } else {
        await api.post('/experience', { ...form, type: tab });
      }
      setModal(null);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await api.delete(`/experience/${id}`); fetchData(); }
    catch (err) { console.error(err); }
  };

  const saveCert = async (form) => {
    try {
      if (form._id) { await api.patch(`/experience/certifications/${form._id}`, form); }
      else { await api.post('/experience/certifications', form); }
      setCertModal(null);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const deleteCert = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try { await api.delete(`/experience/certifications/${id}`); fetchData(); }
    catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience Manager</h1>
        <button onClick={() => setModal({ type: tab })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
          <FiPlus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[{ key: 'work', label: 'Work Experience', icon: FiBriefcase }, { key: 'education', label: 'Education', icon: FiBook }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400">No {tab} entries yet</p>
          </div>
        ) : filtered.map((entry) => (
          <div key={entry._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              {entry.logo ? <img src={entry.logo} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><FiBriefcase className="w-5 h-5 text-gray-400" /></div>}
              <div>
                <p className="font-semibold">{tab === 'work' ? entry.jobTitle : entry.degree}</p>
                <p className="text-sm text-gray-500">{tab === 'work' ? entry.company : entry.institution}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {entry.startDate ? new Date(entry.startDate).getFullYear() : ''} — {entry.present ? 'Present' : entry.endDate ? new Date(entry.endDate).getFullYear() : ''}
                  {entry.location ? ` · ${entry.location}` : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setModal({ type: tab, entry })} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteEntry(entry._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications (under Education tab) */}
      {tab === 'education' && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Certifications</h2>
            <button onClick={() => setCertModal({})} className="text-amber-500 text-sm hover:underline flex items-center gap-1"><FiPlus className="w-3 h-3" /> Add</button>
          </div>
          {certifications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No certifications yet.</p>
          ) : certifications.map((cert) => (
            <div key={cert._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{cert.name}</p>
                <p className="text-xs text-gray-400">{cert.organization} {cert.issueDate ? `· ${new Date(cert.issueDate).getFullYear()}` : ''}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setCertModal(cert)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><FiEdit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteCert(cert._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry Modal */}
      <AnimatePresence>
        {modal && <ExperienceFormModal data={modal} onSave={saveEntry} onClose={() => setModal(null)} />}
      </AnimatePresence>

      {/* Cert Modal */}
      <AnimatePresence>
        {certModal && <CertFormModal data={certModal} onSave={saveCert} onClose={() => setCertModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

const ExperienceFormModal = ({ data, onSave, onClose }) => {
  const isWork = data.type === 'work';
  const [form, setForm] = useState({
    company: '', jobTitle: '', employmentType: '', institution: '', degree: '', fieldOfStudy: '',
    startDate: '', endDate: '', present: false, location: '', description: '', technologies: [],
    logo: '', websiteUrl: '', relevantCoursework: [],
    ...data.entry,
    startDate: data.entry?.startDate?.slice(0, 10) || '',
    endDate: data.entry?.endDate?.slice(0, 10) || '',
  });
  const [techInput, setTechInput] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg mx-4 shadow-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold">{data.entry ? 'Edit' : 'Add'} {isWork ? 'Work Experience' : 'Education'}</h3>
        {isWork ? (
          <>
            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company *"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
            <input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="Job Title *"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
            <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none">
              <option value="">Employment Type</option>
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option><option>Internship</option>
            </select>
          </>
        ) : (
          <>
            <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution *"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
            <input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Degree"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
            <input type="text" value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} placeholder="Field of Study"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
          <div className="flex items-center gap-2">
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.present}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none disabled:opacity-50" />
            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
              <input type="checkbox" checked={form.present} onChange={(e) => setForm({ ...form, present: e.target.checked })} className="w-3 h-3" /> Now
            </label>
          </div>
        </div>
        <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none resize-none" />
        {isWork && (
          <div>
            <div className="flex gap-2 mb-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (techInput.trim()) { setForm({ ...form, technologies: [...form.technologies, techInput.trim()] }); setTechInput(''); } } }}
                placeholder="Add technology..." className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
            </div>
            <div className="flex flex-wrap gap-1">
              {form.technologies?.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  {t} <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500"><FiX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
        </div>
      </motion.div>
    </div>
  );
};

const CertFormModal = ({ data, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '', organization: '', issueDate: '', expiryDate: '', credentialUrl: '',
    ...data, issueDate: data.issueDate?.slice(0, 10) || '', expiryDate: data.expiryDate?.slice(0, 10) || '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-xl w-full space-y-4">
        <h3 className="text-lg font-bold">{data._id ? 'Edit' : 'Add'} Certification</h3>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name *"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Issuing Organization *"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-500 mb-1 block">Issue Date</label><input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" /></div>
          <div><label className="text-xs text-gray-500 mb-1 block">Expiry Date</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" /></div>
        </div>
        <input type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="Credential URL"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExperiencePage;
