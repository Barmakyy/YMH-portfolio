import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFolder, FiFileText, FiMessageSquare, FiImage,
  FiPlus, FiEdit3, FiMail, FiUpload,
  FiTrendingUp, FiCheck, FiAlertCircle, FiArrowRight,
} from 'react-icons/fi';
import api from '../api';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const activities = data?.activities || [];
  const healthChecks = data?.healthChecks || [];

  const statCards = [
    { label: 'Published Projects', value: stats.publishedProjects, icon: FiFolder, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Published Posts', value: stats.publishedPosts, icon: FiFileText, color: 'bg-green-500/10 text-green-600' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: FiMessageSquare, color: 'bg-amber-500/10 text-amber-600' },
    { label: 'Media Files', value: stats.totalMedia, icon: FiImage, color: 'bg-purple-500/10 text-purple-600' },
  ];

  const quickActions = [
    { label: 'Add New Project', icon: FiPlus, to: '/admin/projects/new', color: 'bg-blue-500' },
    { label: 'Write New Post', icon: FiEdit3, to: '/admin/blog/new', color: 'bg-green-500' },
    { label: 'View Messages', icon: FiMail, to: '/admin/messages', color: 'bg-amber-500' },
    { label: 'Upload Media', icon: FiUpload, to: '/admin/media', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s your site overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <FiTrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-2xl font-bold">{card.value ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Most Viewed Project */}
      {stats.mostViewedProject && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-center gap-4">
          <FiTrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Most Viewed Project</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.mostViewedProject.title}</span>
              {' '}— {stats.mostViewedProject.views} views
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-black font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">No recent activity.</p>
            ) : (
              activities.map((activity, i) => (
                <Link
                  key={i}
                  to={activity.link}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'message' ? 'bg-amber-500' :
                    activity.type === 'blog' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-gray-400">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Health */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-black font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-center group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Content Health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-black font-semibold mb-3">Content Health</h2>
            <ul className="space-y-2">
              {healthChecks.map((check, i) => (
                <li key={i}>
                  <Link
                    to={check.link}
                    className="flex items-center gap-2.5 text-sm hover:text-amber-600 transition-colors"
                  >
                    {check.passed ? (
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <FiAlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span className={check.passed ? 'line-through text-gray-400' : ''}>
                      {check.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
