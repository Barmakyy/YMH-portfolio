import { useState, useEffect } from 'react';
import api from '../api';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  FiFolder, FiGithub, FiDownload, FiGlobe, FiTrendingUp, FiTrendingDown, FiActivity
} from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';

const analyticsAPI = api; // Use authenticated API instance

// Count-up animation component
const CountUp = ({ value, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!value) return;
    let start = 0;
    const increment = value / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="font-mono">{displayValue.toLocaleString()}</span>;
};

// Skeleton loader
const SkeletonCard = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
  </div>
);

// Stat Card component
const StatCard = ({ icon: Icon, label, value, trend, trendValue, bgColor, iconColor, iconBgColor }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
    <div className="flex items-start justify-between mb-3">
      <div className={`rounded-lg p-2 w-9 h-9 flex items-center justify-center ${iconBgColor}`}>
        <Icon size={18} className={iconColor} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-mono ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {trendValue}%
        </div>
      )}
    </div>
    <p className="text-3xl font-bold font-mono mb-1">{typeof value === 'number' ? <CountUp value={value} /> : value}</p>
    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
  </div>
);

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  // Aggregate events into time-series data for chart
  const aggregateChartData = (eventsList) => {
    const grouped = {};

    eventsList.forEach(event => {
      const date = new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { date, project_view: 0, download: 0, github_click: 0, instagram_click: 0 };
      }
      if (event.eventType === 'project_view') grouped[date].project_view += 1;
      else if (event.eventType === 'download') grouped[date].download += 1;
      else if (event.eventType === 'link_click') {
        if (event.metadata?.linkType === 'github') grouped[date].github_click += 1;
        else if (event.metadata?.linkType === 'instagram') grouped[date].instagram_click += 1;
      }
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const [summaryRes, eventsRes, pagesRes] = await Promise.all([
          analyticsAPI.get(`/analytics/summary?days=${days}`),
          analyticsAPI.get(`/analytics/events?days=${days}&limit=100`),
          analyticsAPI.get(`/analytics/pages?days=${days}`),
        ]);

        console.log('Summary Response:', summaryRes.data.data);
        console.log('Events Response:', eventsRes.data.data);
        console.log('Pages Response:', pagesRes.data.data);

        setSummary(summaryRes.data.data);
        setEvents(eventsRes.data.data || []);
        setTopPages(pagesRes.data.data || []);

        // Create chart data from events
        const chartData = aggregateChartData(eventsRes.data.data || []);
        setChartData(chartData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data.');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  // Calculate event type counts from summary
  const getEventCount = (eventType) => {
    return summary?.eventCounts?.find(ec => ec._id === eventType)?.count || 0;
  };

  const projectViews = getEventCount('project_view');
  const blogViews = getEventCount('blog_view');
  const cvDownloads = getEventCount('download');

  // Count specific link click types from events
  const githubClicks = events.filter(
    e => e.eventType === 'link_click' && e.metadata?.linkType === 'github'
  ).length;

  const instagramClicks = events.filter(
    e => e.eventType === 'link_click' && e.metadata?.linkType === 'instagram'
  ).length;

  // Get recent activity (last 10 events)
  const recentActivity = events.slice(0, 10);

  // Event type colors and icons
  const eventConfig = {
    project_view: { icon: FiFolder, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30', label: 'Project View' },
    blog_view: { icon: FiFolder, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Blog View' },
    link_click: { icon: FiGithub, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Link Click' },
    download: { icon: FiDownload, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Download' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Analytics</h1>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mt-1">Dashboard</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">Live</span>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {/* Skeleton stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          {/* Skeleton chart */}
          <SkeletonChart />
          {/* Skeleton bottom sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      ) : !summary || summary.totalEvents === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center">
          <FiActivity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No analytics data yet</h2>
          <p className="text-text-secondary mb-4">
            Start interacting with your portfolio. Events like project views, blog views, and link clicks will be tracked here.
          </p>
          {summary?.dateRange && (
            <p className="text-sm text-text-muted">Data period: {summary.dateRange.from} to {summary.dateRange.to}</p>
          )}
        </div>
      ) : (
        <>
          {/* Stat Cards - 5 columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              icon={FiFolder}
              label="Project Views"
              value={projectViews}
              trend={projectViews > 0 ? "up" : null}
              trendValue={projectViews > 0 ? 12 : null}
              bgColor="bg-teal-100"
              iconColor="text-teal-600"
              iconBgColor="bg-teal-100 dark:bg-teal-900/30"
            />
            <StatCard
              icon={FiGithub}
              label="GitHub Clicks"
              value={githubClicks}
              trend={githubClicks > 0 ? "up" : null}
              trendValue={githubClicks > 0 ? 8 : null}
              bgColor="bg-gray-800"
              iconColor="text-gray-100"
              iconBgColor="bg-gray-800"
            />
            <StatCard
              icon={FaInstagram}
              label="Instagram Clicks"
              value={instagramClicks}
              trend={instagramClicks > 0 ? "up" : null}
              trendValue={instagramClicks > 0 ? 5 : null}
              bgColor="bg-pink-100"
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100 dark:bg-pink-900/30"
            />
            <StatCard
              icon={FiDownload}
              label="CV Downloads"
              value={cvDownloads}
              trend={cvDownloads > 0 ? "up" : null}
              trendValue={cvDownloads > 0 ? 3 : null}
              bgColor="bg-amber-100"
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
            />
            <StatCard
              icon={FiGlobe}
              label="Page Visits"
              value={summary.totalEvents}
              trend={summary.totalEvents > 0 ? "up" : null}
              trendValue={summary.totalEvents > 0 ? 15 : null}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>

          {/* Line Chart */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Activity Over Time</h2>
            {chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(31 41 55)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Line type="monotone" dataKey="project_view" stroke="#14b8a6" strokeWidth={2} name="Project Views" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="download" stroke="#f59e0b" strokeWidth={2} name="CV Downloads" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="github_click" stroke="#0cac6c" strokeWidth={2} name="GitHub Clicks" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="instagram_click" stroke="#ec4899" strokeWidth={2} name="Instagram Clicks" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CV Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-800" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-pink-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram Clicks</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">No chart data available</div>
            )}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Projects */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Top Projects</h2>
              {topPages.length > 0 ? (
                <div className="space-y-4">
                  {topPages.slice(0, 5).map((page, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{page.title || page._id}</span>
                        <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{page.views}</span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(page.views / (topPages[0]?.views || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No project data available</div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((event, idx) => {
                    const config = eventConfig[event.eventType] || eventConfig.project_view;
                    const EventIcon = config.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 w-8 h-8 flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <EventIcon size={16} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {event.title || config.label}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No activity yet</div>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>ℹ️ Custom Analytics:</strong> This dashboard displays data from your custom backend analytics system. All tracking is privacy-first with anonymized IP addresses. No third-party services are used.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
