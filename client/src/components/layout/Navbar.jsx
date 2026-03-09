import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../context';
import logo from '../../assets/logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${isScrolled
          ? 'py-2 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.7)]'
          : 'py-3 bg-gray-950/60 backdrop-blur-md border-b border-gray-800/60 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.4)]'
        }
      `}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-accent/50 group-hover:ring-accent transition-all duration-300">
              <img 
                src={logo} 
                alt="YMH Code Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">
              <span className="text-accent">YMH</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `
                    relative px-3.5 py-1.5 text-[13px] font-bold rounded-full transition-all duration-300
                    ${isActive 
                      ? 'text-accent-contrast bg-accent shadow-md shadow-accent/30 scale-105' 
                      : 'text-gray-200 hover:text-accent hover:bg-white/10 hover:scale-105 hover:shadow-sm'
                    }
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-300 hover:text-accent hover:bg-white/10 hover:scale-110 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.div>
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-accent text-accent-contrast hover:brightness-110 shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Let's Talk
              <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-200 hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <motion.div
              key={isMobileMenuOpen ? 'close' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 bg-gray-950/98 backdrop-blur-xl border-b border-gray-800 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.6)]"
          >
            <div className="container-custom py-5 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, ease: 'easeOut' }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) => `
                      block px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200
                      ${isActive 
                        ? 'text-accent-contrast bg-accent shadow-md scale-[1.02]' 
                        : 'text-gray-200 hover:text-accent hover:bg-white/10 hover:pl-6 hover:shadow-sm'
                      }
                    `}
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
              <div className="pt-4 flex items-center gap-3 border-t border-border/30 mt-3">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-gray-300 hover:text-accent hover:bg-white/10 hover:scale-110 transition-all duration-300"
                >
                  {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
                <Link
                  to="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-accent text-accent-contrast shadow-md shadow-accent/25 hover:brightness-110 transition-all duration-300"
                >
                  Let's Talk
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
