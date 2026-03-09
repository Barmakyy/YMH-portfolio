import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiHeart, FiInstagram } from 'react-icons/fi';

const socialLinks = [
  { name: 'GitHub', icon: FiGithub, href: import.meta.env.VITE_GITHUB_URL },
  { name: 'LinkedIn', icon: FiLinkedin, href: import.meta.env.VITE_LINKEDIN_URL },
  { name: 'Twitter', icon: FiTwitter, href: import.meta.env.VITE_TWITTER_URL },
  { name: 'Email', icon: FiMail, href: `mailto:${import.meta.env.VITE_EMAIL}` },
  { name: 'Instagram', icon: FiInstagram, href: import.meta.env.VITE_INSTAGRAM_URL },
];

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Blog', path: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Skills', path: '/skills' },
      { name: 'Experience', path: '/experience' },
      { name: 'Contact', path: '/contact' },
      
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="inline-block text-2xl font-bold font-display text-text-primary mb-4"
            >
              <span className="text-accent">&lt;</span>
              YMH 
              <span className="text-accent">/&gt;</span>
            </Link>
            <p className="text-text-secondary mb-6 max-w-md">
              Full-Stack Developer passionate about building web applications 
              from database to deployment. Let's create something amazing together.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-secondary hover:text-accent transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} All rights reserved.
          </p>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;
