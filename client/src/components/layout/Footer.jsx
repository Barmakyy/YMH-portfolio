import { Link, useLocation } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiHeart, FiInstagram } from 'react-icons/fi';
import { useTheme } from '../../context';

const socialLinks = [
  { name: 'GitHub', icon: FiGithub, href: import.meta.env.VITE_GITHUB_URL },
  { name: 'LinkedIn', icon: FiLinkedin, href: import.meta.env.VITE_LINKEDIN_URL },
  { name: 'Twitter', icon: FiTwitter, href: import.meta.env.VITE_TWITTER_URL },
  { name: 'Email', icon: FiMail, href: `mailto:${import.meta.env.VITE_EMAIL}` },
  { name: 'Instagram', icon: FiInstagram, href: import.meta.env.VITE_INSTAGRAM_URL },
];

const Footer = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const isProjectsPage = location.pathname.startsWith('/projects');
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-border ${isProjectsPage && !isDark ? 'bg-white' : 'bg-bg-secondary'}`}
    >
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Left Side: Logo and Social Links */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Link 
              to="/" 
              className="inline-block text-2xl font-bold font-display text-text-primary"
            >
              <span className="text-accent">&lt;</span>
              YMH 
              <span className="text-accent">/&gt;</span>
            </Link>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full text-text-secondary hover:text-accent hover:bg-hover-bg transition-all duration-300 transform hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-text-muted text-sm">
            © {currentYear} YMH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
