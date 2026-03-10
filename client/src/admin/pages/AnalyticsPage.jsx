import { FiBarChart2 } from 'react-icons/fi';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <FiBarChart2 className="w-16 h-16 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-black font-semibold mb-2">Analytics Not Configured</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
          To view analytics data, configure your Google Analytics or Plausible credentials in Settings → Integrations.
        </p>
        <a href="/admin/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
          Go to Settings
        </a>
      </div>
    </div>
  );
};

export default AnalyticsPage;
