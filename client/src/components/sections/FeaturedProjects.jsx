import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import { Card, Badge } from '../ui';

// Mock data - will be replaced with API data
const featuredProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    shortDescription: 'Full-stack MERN e-commerce solution with payment integration and admin dashboard.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    title: 'Project Management App',
    slug: 'project-management-app',
    shortDescription: 'Real-time collaborative project management tool with Kanban boards.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    techStack: ['React', 'Express', 'Socket.io', 'MongoDB'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Social Media Dashboard',
    slug: 'social-media-dashboard',
    shortDescription: 'Analytics dashboard for tracking social media metrics and engagement.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    techStack: ['React', 'Node.js', 'Chart.js', 'REST API'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturedProjects = () => {
  return (
    <section id="featured-projects" className="py-24 bg-bg-primary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Selected Work</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            A showcase of projects that demonstrate my skills in full-stack development
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="h-full flex flex-col overflow-hidden group" padding={false}>
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Link 
                      to={`/projects/${project.slug}`}
                      className="text-white font-medium flex items-center gap-2 hover:text-accent transition-colors"
                    >
                      View Case Study <FiArrowRight />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 flex-grow">
                    {project.shortDescription}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="accent" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <FiExternalLink size={16} />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <FiGithub size={16} />
                      GitHub
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            See All Projects
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
