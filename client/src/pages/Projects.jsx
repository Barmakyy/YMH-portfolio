import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiExternalLink, FiGithub, FiArrowRight, FiX, FiEye, FiStar, FiCode,
  FiLayers, FiSearch, FiGrid, FiList, FiFolder, FiCalendar
} from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';
import { Card, Badge, Button } from '../components/ui';

// Mock data - will be replaced with API data
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    shortDescription: 'Full-stack MERN e-commerce solution with cart functionality, user authentication, and responsive design.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
    projectType: ['fullstack', 'personal'],
    status: 'Live',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 120, duration: '3 weeks' },
    highlights: ['JWT Auth', 'Cart System', 'REST API'],
    completedDate: '2024',
  },
  {
    id: 2,
    title: 'Task Management App',
    slug: 'task-management-app',
    shortDescription: 'Kanban-style project management tool with drag-and-drop functionality.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    techStack: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
    projectType: ['fullstack', 'personal'],
    status: 'Live',
    featured: true,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 85, duration: '2 weeks' },
    highlights: ['Drag & Drop', 'CRUD', 'Clean UI'],
    completedDate: '2024',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    shortDescription: 'Beautiful weather application with location-based forecasts and animations.',
    coverImage: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
    techStack: ['React', 'OpenWeather API', 'Framer Motion', 'CSS'],
    projectType: ['frontend', 'personal'],
    status: 'Live',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 45, duration: '1 week' },
    highlights: ['API Integration', 'Geolocation'],
    completedDate: '2024',
  },
  {
    id: 4,
    title: 'Blog CMS',
    slug: 'blog-cms',
    shortDescription: 'Content management system with markdown support and image uploads.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    techStack: ['Node.js', 'Express', 'MongoDB', 'React', 'Cloudinary'],
    projectType: ['fullstack', 'personal'],
    status: 'Live',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 68, duration: '2 weeks' },
    highlights: ['Markdown', 'Image Upload'],
    completedDate: '2024',
  },
  {
    id: 5,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    shortDescription: 'Modern portfolio with dark mode, smooth animations, and responsive design.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    projectType: ['frontend', 'personal'],
    status: 'Live',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 95, duration: '2 weeks' },
    highlights: ['Dark Mode', 'Animations'],
    completedDate: '2025',
  },
  {
    id: 6,
    title: 'Expense Tracker',
    slug: 'expense-tracker',
    shortDescription: 'Personal finance app with charts, categories, and budget tracking.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    techStack: ['React', 'Chart.js', 'Node.js', 'MongoDB'],
    projectType: ['fullstack', 'personal'],
    status: 'Live',
    featured: false,
    liveUrl: '#',
    githubUrl: '#',
    metrics: { commits: 62, duration: '2 weeks' },
    highlights: ['Charts', 'Budget Goals'],
    completedDate: '2024',
  },
];

const techFilters = ['All', 'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'];
const typeFilters = ['All', 'Full-Stack', 'Frontend'];

const typeMap = {
  'Full-Stack': 'fullstack',
  'Frontend': 'frontend',
};

const statusColors = {
  'Live': 'success',
  'In Development': 'warning',
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
  { icon: FiFolder, label: 'Projects', value: '8+' },
  { icon: FiCode, label: 'Commits', value: '500+' },
  { icon: FiGithub, label: 'Repos', value: '15+' },
  { icon: FiStar, label: 'Tech Used', value: '12+' },
];

const Projects = () => {
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const filteredProjects = projects.filter((project) => {
    const techMatch = selectedTech === 'All' || project.techStack.includes(selectedTech);
    const typeMatch = selectedType === 'All' || project.projectType.includes(typeMap[selectedType]);
    const searchMatch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return techMatch && typeMatch && searchMatch;
  });

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  const clearFilters = () => {
    setSelectedTech('All');
    setSelectedType('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTech !== 'All' || selectedType !== 'All' || searchQuery;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://i.pinimg.com/1200x/89/b9/49/89b94950b914f97a4c4831dcd1044dcc.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />

        <div className="container-custom relative z-10 text-center py-24">
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
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Projects I've <span className="text-accent">Built</span>
            </h1>
            
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
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
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                >
                  <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white drop-shadow-sm">{stat.value}</div>
                  <div className="text-xs text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom pt-10">

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="sticky top-20 z-30 py-4 bg-bg-primary/95 backdrop-blur-lg border-b border-border mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Tech Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {techFilters.map((tech) => {
                const TechIcon = techIcons[tech];
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all
                      ${selectedTech === tech
                        ? 'bg-accent text-neutral-900 font-semibold'
                        : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
                      }
                    `}
                  >
                    {TechIcon && <TechIcon className="w-3.5 h-3.5" />}
                    {tech}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-8 bg-border hidden lg:block" />

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg transition-all
                    ${selectedType === type
                      ? 'bg-accent text-neutral-900 font-semibold'
                      : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center bg-bg-secondary border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-accent text-neutral-900' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-accent text-neutral-900' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-red-400 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 text-sm text-text-muted">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && !hasActiveFilters && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <FiStar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Featured Projects</h2>
                <p className="text-text-muted text-sm">My best work</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden group" padding={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                      <div className="relative aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          <Badge variant={statusColors[project.status]} size="sm">{project.status}</Badge>
                          <Badge variant="accent" size="sm">Featured</Badge>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                          <FiCalendar className="w-3 h-3" />
                          {project.completedDate} · {project.metrics.duration}
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-text-secondary text-sm mb-4 flex-grow">
                          {project.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.highlights.map((highlight) => (
                            <span key={highlight} className="px-2 py-1 bg-bg-tertiary text-text-secondary text-xs rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech) => (
                            <Badge key={tech} size="sm">{tech}</Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-text-muted mb-4 py-3 border-t border-border">
                          <span className="flex items-center gap-1">
                            <FiCode className="w-3 h-3" />
                            {project.metrics.commits} commits
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={`/projects/${project.slug}`}
                            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all"
                          >
                            View Details <FiArrowRight className="w-4 h-4" />
                          </Link>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-text-secondary hover:text-accent transition-colors"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-text-secondary hover:text-accent transition-colors"
                            >
                              <FiGithub className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          {!hasActiveFilters && (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                <FiLayers className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">All Projects</h2>
                <p className="text-text-muted text-sm">Everything I've built</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(hasActiveFilters ? filteredProjects : regularProjects).map((project, index) => (
                    <motion.div
                      key={project.id}
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
                          <div className="absolute top-3 left-3">
                            <Badge variant={statusColors[project.status]} size="sm">
                              {project.status}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 text-neutral-900 rounded-lg hover:bg-accent transition-colors"
                              >
                                <FiExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 text-neutral-900 rounded-lg hover:bg-accent transition-colors"
                              >
                                <FiGithub className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                            <FiCalendar className="w-3 h-3" />
                            {project.completedDate}
                          </div>

                          <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                          </h3>
                          
                          <p className="text-text-secondary text-sm mb-4 flex-grow line-clamp-2">
                            {project.shortDescription}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techStack.slice(0, 4).map((tech) => (
                              <Badge key={tech} size="sm">{tech}</Badge>
                            ))}
                            {project.techStack.length > 4 && (
                              <Badge size="sm" variant="secondary">+{project.techStack.length - 4}</Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <Link
                              to={`/projects/${project.slug}`}
                              className="flex items-center gap-1 text-sm text-accent font-medium hover:gap-2 transition-all"
                            >
                              View Details <FiArrowRight className="w-3 h-3" />
                            </Link>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                              <span className="flex items-center gap-1">
                                <FiCode className="w-3 h-3" />
                                {project.metrics.commits}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div layout className="space-y-4">
                  {(hasActiveFilters ? filteredProjects : regularProjects).map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group overflow-hidden" padding={false}>
                        <div className="flex flex-col sm:flex-row gap-4 p-4">
                          <div className="sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-grow flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={statusColors[project.status]} size="sm">{project.status}</Badge>
                              <span className="text-xs text-text-muted">{project.completedDate}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-3 line-clamp-2">{project.shortDescription}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {project.techStack.slice(0, 5).map((tech) => (
                                <Badge key={tech} size="sm">{tech}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-auto">
                              <Link to={`/projects/${project.slug}`} className="text-sm text-accent font-medium hover:underline">
                                View Details
                              </Link>
                              {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent flex items-center gap-1">
                                  <FiExternalLink className="w-3 h-3" /> Demo
                                </a>
                              )}
                              {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent flex items-center gap-1">
                                  <FiGithub className="w-3 h-3" /> Code
                                </a>
                              )}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-xl font-bold mb-2">No projects found</h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center py-16 px-8 bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border rounded-2xl"
        >
          <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiOutlineLightningBolt className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Have a Project in Mind?</h3>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
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
