import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser, FiDroplet, FiFileText, FiActivity, FiStar,
  FiLink, FiShield, FiSave, FiUpload, FiTrash2, FiPlus, FiX,
} from 'react-icons/fi';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { key: 'profile', label: 'Profile', icon: FiUser },
  { key: 'appearance', label: 'Appearance', icon: FiDroplet },
  { key: 'resume', label: 'Resume', icon: FiFileText },
  { key: 'availability', label: 'Availability', icon: FiActivity },
  { key: 'testimonials', label: 'Testimonials', icon: FiStar },
  { key: 'integrations', label: 'Integrations', icon: FiLink },
  { key: 'security', label: 'Security', icon: FiShield },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setSettings(data.data);
      setLoading(false);
    }).catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/settings', settings);
      setSettings(data.data);
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const updateField = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;
  if (!settings) return <div className="text-center py-12 text-gray-400">Failed to load settings.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button onClick={saveSettings} disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50">
          <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 gap-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'profile' && <ProfileTab settings={settings} updateField={updateField} />}
        {activeTab === 'appearance' && <AppearanceTab settings={settings} updateField={updateField} />}
        {activeTab === 'resume' && <ResumeTab settings={settings} updateField={updateField} />}
        {activeTab === 'availability' && <AvailabilityTab settings={settings} updateField={updateField} />}
        {activeTab === 'testimonials' && <TestimonialsTab settings={settings} setSettings={setSettings} />}
        {activeTab === 'integrations' && <IntegrationsTab settings={settings} updateField={updateField} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', placeholder = '', ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" {...props} />
  </div>
);

const ProfileTab = ({ settings, updateField }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Profile</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Full Name" value={settings.fullName} onChange={(v) => updateField('fullName', v)} />
      <InputField label="Job Title" value={settings.jobTitle} onChange={(v) => updateField('jobTitle', v)} />
      <InputField label="Email" value={settings.email} onChange={(v) => updateField('email', v)} type="email" />
      <InputField label="Location" value={settings.location} onChange={(v) => updateField('location', v)} />
      <InputField label="Timezone" value={settings.timezone} onChange={(v) => updateField('timezone', v)} placeholder="e.g. Africa/Nairobi" />
      <InputField label="Profile Photo URL" value={settings.profilePhoto} onChange={(v) => updateField('profilePhoto', v)} type="url" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea value={settings.bio || ''} onChange={(e) => updateField('bio', e.target.value)} rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
    </div>
  </div>
);

const AppearanceTab = ({ settings, updateField }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Appearance</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Accent Color</label>
        <div className="flex items-center gap-3">
          <input type="color" value={settings.accentColor || '#f59e0b'} onChange={(e) => updateField('accentColor', e.target.value)}
            className="w-10 h-10 rounded border-none cursor-pointer" />
          <input type="text" value={settings.accentColor || '#f59e0b'} onChange={(e) => updateField('accentColor', e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Default Color Mode</label>
        <select value={settings.defaultColorMode || 'dark'} onChange={(e) => updateField('defaultColorMode', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </select>
      </div>
    </div>
    <InputField label="Footer Text Override" value={settings.footerText} onChange={(v) => updateField('footerText', v)} />
    <InputField label="OG Default Image URL" value={settings.ogDefaultImage} onChange={(v) => updateField('ogDefaultImage', v)} type="url" />
  </div>
);

const ResumeTab = ({ settings, updateField }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Resume</h2>
    <InputField label="Resume PDF URL" value={settings.resumeUrl} onChange={(v) => updateField('resumeUrl', v)} type="url" placeholder="Upload via Media Library, then paste URL here" />
    {settings.resumeUrl && (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <iframe src={settings.resumeUrl} className="w-full h-96" title="Resume Preview" />
      </div>
    )}
  </div>
);

const AvailabilityTab = ({ settings, updateField }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Availability</h2>
    <div>
      <label className="block text-sm font-medium mb-1">Status</label>
      <select value={settings.availabilityStatus} onChange={(e) => updateField('availabilityStatus', e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none">
        <option>Open to Opportunities</option>
        <option>Selectively Looking</option>
        <option>Not Available</option>
      </select>
    </div>
    <InputField label="Status Note" value={settings.availabilityNote} onChange={(v) => updateField('availabilityNote', v)} placeholder="e.g. Available from March 2026" />
  </div>
);

const TestimonialsTab = ({ settings, setSettings }) => {
  const [editing, setEditing] = useState(null);

  const addTestimonial = async () => {
    try {
      const { data } = await api.post('/settings/testimonials', { quote: 'New testimonial', authorName: 'Author', display: true });
      setSettings((prev) => ({ ...prev, testimonials: data.data }));
    } catch (err) { console.error(err); }
  };

  const updateTestimonial = async (id, updates) => {
    try {
      const { data } = await api.patch(`/settings/testimonials/${id}`, updates);
      setSettings((prev) => ({ ...prev, testimonials: data.data }));
      setEditing(null);
    } catch (err) { console.error(err); }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const { data } = await api.delete(`/settings/testimonials/${id}`);
      setSettings((prev) => ({ ...prev, testimonials: data.data }));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Testimonials</h2>
        <button onClick={addTestimonial} className="text-amber-500 text-sm hover:underline flex items-center gap-1">
          <FiPlus className="w-3 h-3" /> Add
        </button>
      </div>
      {settings.testimonials?.map((t) => (
        <div key={t._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
          {editing === t._id ? (
            <TestimonialForm testimonial={t} onSave={(updates) => updateTestimonial(t._id, updates)} onCancel={() => setEditing(null)} />
          ) : (
            <>
              <p className="text-sm italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-gray-500">— {t.authorName}{t.authorTitle ? `, ${t.authorTitle}` : ''}</p>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditing(t._id)} className="text-xs text-amber-500 hover:underline">Edit</button>
                <button onClick={() => deleteTestimonial(t._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                <button onClick={() => updateTestimonial(t._id, { display: !t.display })}
                  className={`text-xs ${t.display ? 'text-green-500' : 'text-gray-400'} hover:underline`}>
                  {t.display ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const TestimonialForm = ({ testimonial, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...testimonial });
  return (
    <div className="space-y-3">
      <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none resize-none" placeholder="Quote" />
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} placeholder="Author Name"
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
        <input type="text" value={form.authorTitle || ''} onChange={(e) => setForm({ ...form, authorTitle: e.target.value })} placeholder="Title/Company"
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600">Cancel</button>
        <button onClick={() => onSave(form)} className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
      </div>
    </div>
  );
};

const IntegrationsTab = ({ settings, updateField }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Integrations</h2>
    <div className="space-y-4">
      <InputField label="Google Analytics Measurement ID" value={settings.googleAnalyticsId} onChange={(v) => updateField('googleAnalyticsId', v)} placeholder="G-XXXXXXXXXX" />
      <InputField label="Plausible Domain" value={settings.plausibleDomain} onChange={(v) => updateField('plausibleDomain', v)} placeholder="yourdomain.com" />
      <InputField label="GitHub Username" value={settings.githubUsername} onChange={(v) => updateField('githubUsername', v)} />
      <InputField label="Calendly / Cal.com URL" value={settings.calendlyUrl} onChange={(v) => updateField('calendlyUrl', v)} type="url" />
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-semibold mb-3">reCAPTCHA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Site Key" value={settings.recaptchaSiteKey} onChange={(v) => updateField('recaptchaSiteKey', v)} />
          <InputField label="Secret Key" value={settings.recaptchaSecretKey} onChange={(v) => updateField('recaptchaSecretKey', v)} />
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.patch('/auth/update-password', { currentPassword, newPassword });
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update password.');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Security</h2>
      <div className="max-w-md space-y-4">
        <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
        <InputField label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="Min 8 characters" />
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        <button onClick={handleChangePassword} disabled={saving || !currentPassword || !newPassword}
          className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 disabled:opacity-50">
          {saving ? 'Updating...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
