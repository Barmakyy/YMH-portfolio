import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import { Card, Badge } from '../ui';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/projects/public`)
      .then(({ data }) => {
        const projects = data.data || [];
        // Show featured projects first, fallback to latest 3
        const featured = projects.filter(p => p.featured);
        setFeaturedProjects(featured.length > 0 ? featured.slice(0, 3) : projects.slice(0, 3));
      })
      .catch(err => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-bg-primary">
        <div className="container-custom flex justify-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0) return null;

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
            <motion.div key={project._id} variants={itemVariants}>
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
                    {(project.techStack || []).map((tech) => (
                      <Badge key={tech} variant="accent" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <FiExternalLink size={16} />
                      Live Demo
                    </a>
                    )}
                    {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <FiGithub size={16} />
                      GitHub
                    </a>
                    )}
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
