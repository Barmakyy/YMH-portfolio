import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiArrowLeft, FiArrowRight, FiCalendar, FiUsers, FiTag } from 'react-icons/fi';
import { Badge, Button, Card } from '../components/ui';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiStripe, SiRedux,
  SiTailwindcss, SiSocketdotio, SiJavascript
} from 'react-icons/si';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tech icon mapping
const techIcons = {
  'React': { icon: SiReact, color: '#61DAFB' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Express': { icon: SiExpress, color: '#ffffff' },
  'Stripe': { icon: SiStripe, color: '#635BFF' },
  'Redux': { icon: SiRedux, color: '#764ABC' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'Tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
  'Socket.io': { icon: SiSocketdotio, color: '#ffffff' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/projects/public/${slug}`)
      .then(({ data }) => setProject(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !project) {
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
            {project.projectType?.length > 0 && (
              <span className="flex items-center gap-1">
                <FiTag size={14} />
                {project.projectType.join(', ')}
              </span>
            )}
            {(project.startDate || project.endDate) && (
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                {project.endDate || project.ongoing ? ' – ' : ''}
                {project.ongoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiUsers size={14} />
              {project.teamSize === 1 ? 'Solo Project' : `Team of ${project.teamSize}`}
            </span>
            <Badge variant="success">{project.status === 'published' ? 'Live' : project.status}</Badge>
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
            className="w-full max-h-[400px] object-contain mx-auto"
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

          {/* Overview / Body */}
          {project.body && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <div 
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.body }}
              />
            </motion.section>
          )}

          {/* Other Links */}
          {project.otherLinks?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6">Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.otherLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg text-sm hover:border-accent transition-colors">
                    <FiExternalLink size={14} /> {link.label}
                  </a>
                ))}
              </div>
            </motion.section>
          )}

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
