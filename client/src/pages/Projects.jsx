import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiExternalLink, FiGithub, FiArrowRight, FiX, FiEye, FiStar, FiCode,
  FiLayers, FiSearch, FiGrid, FiList, FiFolder, FiCalendar, FiAlertCircle
} from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiThreedotjs } from 'react-icons/si';
import { Card, Badge, Button } from '../components/ui';
import axios from 'axios';
import { OGLBackground } from '../components/effects';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const techFilters = ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'];
const typeFilters = ['Full-Stack', 'Frontend'];

const typeMap = {
  'Full-Stack': ['Full-Stack App', 'fullstack'],
  'Frontend': ['Frontend', 'frontend'],
};

const statusColors = {
  'published': 'success',
  'Live': 'success',
  'draft': 'warning',
  'In Development': 'warning',
  'archived': 'default',
  'Archived': 'default',
};

const techIcons = {
  'React': SiReact,
  'Node.js': SiNodedotjs,
  'MongoDB': SiMongodb,
  'Express': SiExpress,
  'Tailwind CSS': SiTailwindcss,
};

const projectStats = [
  { icon: FiFolder, label: 'Projects', getValue: (p) => p.length || '0' },
  { icon: FiEye, label: 'Total Views', getValue: (p) => p.reduce((sum, proj) => sum + (proj.views || 0), 0) },
  { icon: FiGithub, label: 'Repos', value: '15+' },
  { icon: FiStar, label: 'Tech Used', getValue: (p) => new Set(p.flatMap((proj) => proj.techStack || [])).size || '0' },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    axios.get(`${API_URL}/projects/public`)
      .then(({ data }) => setProjects(data.data))
      .catch((err) => {
        console.error('Failed to fetch projects:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(project => {
      const searchMatch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const techMatch = selectedTech === 'All' || project.techStack.includes(selectedTech);
      const typeMatch = selectedType === 'All' || project.type === selectedType;
      return searchMatch && techMatch && typeMatch;
    });
  }, [projects, searchQuery, selectedTech, selectedType]);

  const featuredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => p.isFeatured);
  }, [projects]);

  const regularProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => !p.isFeatured);
  }, [projects]);

  const hasActiveFilters = searchQuery || selectedTech !== 'All' || selectedType !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTech('All');
    setSelectedType('All');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-white dark:bg-bg-primary">
        <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Error Loading Projects</h2>
        <p className="text-gray-700 dark:text-text-secondary">{error.message}</p>
      </div>
    );
  }

  const statusColors = {
    published: 'success',
    'in-progress': 'warning',
    archived: 'secondary',
  };

  const techIcons = {
    React: SiReact,
    'Node.js': SiNodedotjs,
    MongoDB: SiMongodb,
    JavaScript: SiJavascript,
    TailwindCSS: SiTailwindcss,
    'Three.js': SiThreedotjs,
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      <OGLBackground />
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://i.pinimg.com/1200x/89/b9/49/89b94950b914f97a4c4831dcd1044dcc.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />

        <div className="container-custom relative z-10 text-center py-20">
          {/* Page Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <HiOutlineSparkles className="w-4 h-4" />
              My Work
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Projects I've <span className="text-accent">Built</span>
            </h1>
            
            <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              A collection of projects I've built while learning the MERN stack.
              Each project helped me grow as a developer.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {projectStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl p-4 backdrop-blur-sm"
                >
                  <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm">{stat.getValue ? stat.getValue(projects) : stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom pt-8">

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        ) : (
        <>
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:sticky top-[65px] z-30 py-4 bg-gray-50 dark:bg-bg-primary/95 lg:backdrop-blur-lg border-b border-gray-200 dark:border-border mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-bg-secondary border border-gray-300 dark:border-border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {techFilters.map((tech) => {
                const TechIcon = techIcons[tech];
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all
                      ${selectedTech === tech
                        ? 'bg-accent text-neutral-900 font-semibold'
                        : 'bg-gray-100 dark:bg-bg-secondary text-gray-700 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary border border-gray-300 dark:border-border'
                      }
                    `}
                  >
                    {TechIcon && <TechIcon className="w-3.5 h-3.5" />}
                    {tech}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-6 bg-border hidden lg:block" />

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
            
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all
                    ${selectedType === type
                      ? 'bg-accent text-neutral-900 font-semibold'
                      : 'bg-gray-100 dark:bg-bg-secondary text-gray-700 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary border border-gray-300 dark:border-border'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center bg-gray-100 dark:bg-bg-secondary border border-gray-300 dark:border-border rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-accent text-neutral-900' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-accent text-neutral-900' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-text-muted hover:text-red-400 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-600 dark:text-text-muted">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </motion.div>

        {/* All Projects */}
        <section>
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id || project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden group" padding={false}>
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                            <Badge variant={statusColors[project.status]} size="sm">
                              {project.status === 'published' ? 'Live' : project.status}
                            </Badge>
                            {project.isFeatured && <Badge variant="accent" size="sm">Featured</Badge>}
                          </div>
                          <div className="absolute top-2.5 right-2.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white/90 text-neutral-900 rounded-md hover:bg-accent transition-colors"
                              >
                                <FiExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white/90 text-neutral-900 rounded-md hover:bg-accent transition-colors"
                              >
                                <FiGithub className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="p-4 flex-grow flex flex-col">
                          <div className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
                            <FiCalendar className="w-3 h-3" />
                            {project.startDate ? new Date(project.startDate).getFullYear() : new Date(project.createdAt).getFullYear()}
                          </div>

                          <h3 className="text-md font-bold mb-2 group-hover:text-accent transition-colors">
                            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                          </h3>
                          
                          <p className="text-text-secondary text-sm mb-3 flex-grow line-clamp-2">
                            {project.shortDescription}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.techStack.slice(0, 4).map((tech) => (
                              <Badge key={tech} size="sm">{tech}</Badge>
                            ))}
                            {project.techStack.length > 4 && (
                              <Badge size="sm" variant="secondary">+{project.techStack.length - 4}</Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <Link
                              to={`/projects/${project.slug}`}
                              className="flex items-center gap-1 text-sm text-accent font-medium hover:gap-1.5 transition-all"
                            >
                              View Details <FiArrowRight className="w-3 h-3" />
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <FiEye className="w-3 h-3" />
                                {project.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div layout className="space-y-3">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id || project.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group overflow-hidden" padding={false}>
                        <div className="flex flex-col sm:flex-row gap-4 p-3">
                          <div className="sm:w-40 h-28 flex-shrink-0 rounded-md overflow-hidden">
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-grow flex flex-col">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Badge variant={statusColors[project.status]} size="sm">{project.status === 'published' ? 'Live' : project.status}</Badge>
                              {project.isFeatured && <Badge variant="accent" size="sm">Featured</Badge>}
                              <span className="text-xs text-text-muted ml-auto">{project.startDate ? new Date(project.startDate).getFullYear() : new Date(project.createdAt).getFullYear()}</span>
                            </div>
                            <h3 className="text-md font-bold mb-1 group-hover:text-accent transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-2 line-clamp-1">{project.shortDescription}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.techStack.slice(0, 5).map((tech) => (
                                <Badge key={tech} size="sm">{tech}</Badge>
                              ))}
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2 border-t border-border">
                              <Link
                                to={`/projects/${project.slug}`}
                                className="flex items-center gap-1 text-sm text-accent font-medium hover:gap-1.5 transition-all"
                              >
                                View Details <FiArrowRight className="w-3 h-3" />
                              </Link>
                              <div className="flex items-center gap-3 text-xs text-text-muted">
                                <span className="flex items-center gap-1">
                                  <FiEye className="w-3 h-3" />
                                  {project.views || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FiSearch className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Projects Found</h3>
                <p className="text-gray-700 dark:text-text-secondary mb-6">
                  Your search and filter combination didn't return any results.
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        </>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center py-16 px-8 bg-gradient-to-br from-gray-100 dark:from-bg-secondary to-gray-200 dark:to-bg-tertiary border border-gray-300 dark:border-border rounded-2xl"
        >
          <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiOutlineLightningBolt className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Have a Project in Mind?</h3>
          <p className="text-gray-700 dark:text-text-secondary max-w-md mx-auto mb-8">
            I'm always excited to work on new challenges. Let's build something great together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact">
                <Button size="lg" className="px-10 py-4 text-base">
                  Get in Touch
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <a href={import.meta.env.VITE_GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="px-10 py-4 text-base">
                  <FiGithub className="w-5 h-5" />
                  View GitHub
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Projects;
