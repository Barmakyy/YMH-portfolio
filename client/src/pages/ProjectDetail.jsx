import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiArrowLeft, FiArrowRight, FiCalendar, FiUsers, FiTag } from 'react-icons/fi';
import { Badge, Button, Card } from '../components/ui';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiStripe, SiRedux,
  SiTailwindcss, SiSocketdotio, SiJavascript
} from 'react-icons/si';

// Tech icon mapping
const techIcons = {
  'React': { icon: SiReact, color: '#61DAFB' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Express': { icon: SiExpress, color: '#ffffff' },
  'Stripe': { icon: SiStripe, color: '#635BFF' },
  'Redux': { icon: SiRedux, color: '#764ABC' },
  'Tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
  'Socket.io': { icon: SiSocketdotio, color: '#ffffff' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
};

// Mock data - will be replaced with API data
const projectData = {
  'ecommerce-platform': {
    title: 'E-Commerce Platform',
    shortDescription: 'Full-stack MERN e-commerce solution with payment integration and admin dashboard.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'Redux'],
    projectType: 'Full-Stack Application',
    teamSize: 1,
    timeline: 'Jan 2025 – Mar 2025',
    status: 'Live',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    overview: `
      <p>This e-commerce platform is a comprehensive solution for online retailers, featuring a modern React frontend, 
      a robust Node.js backend, and MongoDB for data persistence. The platform handles everything from product 
      browsing to secure checkout with Stripe payment integration.</p>
      <p>The admin dashboard provides complete control over products, orders, and customer management, 
      making it easy for business owners to manage their online store without technical knowledge.</p>
    `,
    problem: `
      <p>Small and medium businesses often struggle to find affordable e-commerce solutions that don't 
      require extensive technical knowledge to manage. Many existing platforms are either too expensive, 
      too limited in features, or require constant developer intervention for basic operations.</p>
    `,
    solution: `
      <h3>Architecture</h3>
      <p>The application follows a modern three-tier architecture with clear separation of concerns:</p>
      <ul>
        <li><strong>Presentation Layer:</strong> React with Redux for state management</li>
        <li><strong>Business Logic Layer:</strong> Express.js with middleware-based request processing</li>
        <li><strong>Data Layer:</strong> MongoDB with Mongoose ODM for schema validation</li>
      </ul>
      <h3>Key Technical Decisions</h3>
      <p>Redux was chosen for state management due to the complex state requirements of an e-commerce 
      application (cart, user session, product filters, etc.). The predictable state container pattern 
      makes debugging easier and enables powerful features like time-travel debugging.</p>
    `,
    features: [
      { name: 'Product Catalog', description: 'Searchable, filterable product listings with categories and tags' },
      { name: 'Shopping Cart', description: 'Persistent cart with real-time updates and guest checkout support' },
      { name: 'Secure Payments', description: 'Stripe integration with support for multiple payment methods' },
      { name: 'Admin Dashboard', description: 'Complete order, product, and customer management interface' },
      { name: 'User Authentication', description: 'JWT-based auth with secure password hashing' },
      { name: 'Order Tracking', description: 'Real-time order status updates with email notifications' },
    ],
    challenges: [
      {
        challenge: 'Handling concurrent cart updates',
        solution: 'Implemented optimistic updates with rollback on conflict, using Redux middleware to sync with the backend.',
      },
      {
        challenge: 'Payment security compliance',
        solution: 'Used Stripe Elements to ensure PCI compliance, keeping sensitive card data off our servers entirely.',
      },
      {
        challenge: 'Performance with large product catalogs',
        solution: 'Implemented pagination, lazy loading, and MongoDB indexing to maintain sub-200ms response times.',
      },
    ],
    results: [
      { metric: '100+', label: 'Products Managed' },
      { metric: '<200ms', label: 'Avg Response Time' },
      { metric: '99.9%', label: 'Uptime' },
      { metric: '4.8/5', label: 'User Rating' },
    ],
    lessons: [
      'Starting with a well-defined database schema saves significant refactoring time later.',
      'Stripe\'s documentation is excellent – investing time reading it pays off in implementation speed.',
      'Redux boilerplate can be reduced significantly with Redux Toolkit.',
    ],
    relatedProjects: ['project-management-app', 'social-media-dashboard'],
  },
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projectData[slug];

  if (!project) {
    return (
      <div className="py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-text-secondary mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="container-custom">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <FiArrowLeft />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-text-secondary mb-6">{project.shortDescription}</p>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
            <span className="flex items-center gap-1">
              <FiTag size={14} />
              {project.projectType}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={14} />
              {project.timeline}
            </span>
            <span className="flex items-center gap-1">
              <FiUsers size={14} />
              {project.teamSize === 1 ? 'Solo Project' : `Team of ${project.teamSize}`}
            </span>
            <Badge variant="success">{project.status}</Badge>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <FiExternalLink />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="secondary" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <FiGithub />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </motion.header>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 rounded-2xl overflow-hidden border border-border"
        >
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-auto"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Built With</h2>
            <div className="flex flex-wrap gap-4">
              {project.techStack.map((tech) => {
                const techInfo = techIcons[tech];
                return (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg"
                  >
                    {techInfo && <techInfo.icon size={20} style={{ color: techInfo.color }} />}
                    <span className="font-medium">{tech}</span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.overview }}
            />
          </motion.section>

          {/* Problem */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">The Problem</h2>
            <Card className="border-l-4 border-l-warning">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.problem }}
              />
            </Card>
          </motion.section>

          {/* Solution */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">The Solution</h2>
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.solution }}
            />
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <Card key={index}>
                  <h3 className="font-bold mb-2">{feature.name}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Challenges */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Challenges & Solutions</h2>
            <div className="space-y-6">
              {project.challenges.map((item, index) => (
                <Card key={index}>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-error/20 text-error rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-error mb-2">Challenge</h3>
                      <p className="text-text-secondary mb-4">{item.challenge}</p>
                      <h3 className="font-bold text-success mb-2">Solution</h3>
                      <p className="text-text-secondary">{item.solution}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Results */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Results & Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.results.map((result, index) => (
                <Card key={index} className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{result.metric}</div>
                  <div className="text-text-secondary text-sm">{result.label}</div>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Lessons */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Lessons Learned</h2>
            <Card className="bg-bg-tertiary">
              <ul className="space-y-3">
                {project.lessons.map((lesson, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-accent mt-1">💡</span>
                    <span className="text-text-secondary">{lesson}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.section>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center pt-8 border-t border-border"
          >
            <Link
              to="/projects"
              className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <FiArrowLeft />
              All Projects
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 text-accent hover:gap-3 transition-all"
            >
              Like what you see? Let's talk
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
