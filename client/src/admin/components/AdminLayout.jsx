import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiFolder, FiFileText, FiZap, FiBriefcase,
  FiImage, FiMessageSquare, FiBarChart2, FiSettings,
  FiChevronLeft, FiChevronRight, FiMenu, FiX,
  FiExternalLink, FiLogOut, FiUser,
} from 'react-icons/fi';
import api from '../api';

const navItems = [
  { label: 'Dashboard', icon: FiGrid, path: '/admin' },
  { label: 'Projects', icon: FiFolder, path: '/admin/projects' },
  { label: 'Blog', icon: FiFileText, path: '/admin/blog' },
  { label: 'Skills', icon: FiZap, path: '/admin/skills' },
  { label: 'Experience', icon: FiBriefcase, path: '/admin/experience' },
  { label: 'Media', icon: FiImage, path: '/admin/media' },
  { label: 'Messages', icon: FiMessageSquare, path: '/admin/messages', badge: true },
  { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
  { label: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { admin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/messages/unread-count');
        setUnreadCount(data.data.count);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentPage = navItems.find((item) =>
    location.pathname === item.path ||
    (item.path !== '/admin' && location.pathname.startsWith(item.path))
  )?.label || 'Dashboard';

  const handleLogout = async () => {
    await logout();
  };

  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
          <Link to="/admin" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-amber-500">&lt;</span>
            {!collapsed && <span>YMH</span>}
            <span className="text-amber-500">/&gt;</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative
                    ${isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {item.badge && unreadCount > 0 && (
                    <span className={`absolute ${collapsed ? 'top-1 right-1' : 'right-3'} bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1`}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            {collapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-gray-400 hidden sm:block">Admin Panel</p>
              <h1 className="text-black font-semibold">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Site <FiExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  {admin?.avatar ? (
                    <img src={admin.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <FiUser className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium truncate">{admin?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
                      </div>
                      <Link
                        to="/admin/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FiSettings className="w-4 h-4" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiLogOut className="w-4 h-4" /> Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Session expired modal */}
      <SessionExpiredModal />
    </div>
  );
};

const SessionExpiredModal = () => {
  const { sessionExpired, dismissSessionExpired } = useAuth();

  if (!sessionExpired) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-2xl text-center"
      >
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiLogOut className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-black font-bold mb-2">Session Expired</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your session has expired. Please log in again to continue.
        </p>
        <Link
          to="/admin/login"
          onClick={dismissSessionExpired}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-full hover:bg-amber-600 transition-colors"
        >
          Log In Again
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
