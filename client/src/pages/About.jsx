import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiDownload, FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowRight,
  FiCheck, FiMapPin, FiCalendar, FiAward, FiBookOpen, FiCoffee, FiCamera, FiGlobe
} from 'react-icons/fi';
import { HiOutlineBriefcase, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineCode } from 'react-icons/hi';
import { TbBrain, TbRocket, TbMessage2, TbTargetArrow, TbBallFootball } from 'react-icons/tb';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTypescript, SiJavascript,
  SiTailwindcss, SiNextdotjs, SiGit, SiDocker, SiPostgresql, SiRedux,
  SiGraphql, SiFigma, SiPython, SiAmazon, SiHtml5, SiCss3
} from 'react-icons/si';
import { Button, Avatar, Badge, Card } from '../components/ui';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Year Experience', value: 1, icon: HiOutlineCalendar, color: 'bg-neutral-800 text-accent' },
  { label: 'Projects Completed', value: 8, icon: HiOutlineBriefcase, color: 'bg-neutral-800 text-accent' },
  { label: 'GitHub Repos', value: 15, icon: HiOutlineCode, color: 'bg-neutral-800 text-accent' },
  { label: 'Technologies Used', value: 12, icon: HiOutlineUserGroup, color: 'bg-neutral-800 text-accent' },
];

const values = [
  {
    icon: TbTargetArrow,
    title: 'Clean Code First',
    description: 'Writing readable, maintainable code that stands the test of time.',
    color: 'bg-neutral-800/80 text-accent',
  },
  {
    icon: TbRocket,
    title: 'Performance Matters',
    description: 'Every millisecond counts. Optimized applications from day one.',
    color: 'bg-neutral-800/80 text-accent',
  },
  {
    icon: TbMessage2,
    title: 'Clear Communication',
    description: 'Regular updates and transparent discussions throughout projects.',
    color: 'bg-neutral-800/80 text-accent',
  },
  {
    icon: TbBrain,
    title: 'Always Learning',
    description: 'Constantly exploring new technologies and best practices.',
    color: 'bg-neutral-800/80 text-accent',
  },
];

const techStack = {
  frontend: [
    { name: 'React', icon: SiReact, level: 70 },
    { name: 'JavaScript', icon: SiJavascript, level: 75 },
    { name: 'Tailwind CSS', icon: SiTailwindcss, level: 72 },
    { name: 'HTML5', icon: SiHtml5, level: 80 },
    { name: 'CSS3', icon: SiCss3, level: 78 },
    { name: 'Redux', icon: SiRedux, level: 55 },
  ],
  backend: [
    { name: 'Node.js', icon: SiNodedotjs, level: 68 },
    { name: 'Express', icon: SiExpress, level: 70 },
    { name: 'MongoDB', icon: SiMongodb, level: 65 },
    { name: 'REST APIs', icon: SiPostgresql, level: 72 },
  ],
  tools: [
    { name: 'Git', icon: SiGit, level: 70 },
    { name: 'VS Code', icon: SiFigma, level: 85 },
    { name: 'Postman', icon: SiDocker, level: 68 },
    { name: 'Figma', icon: SiFigma, level: 55 },
  ],
};

const workProcess = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Understanding your vision, goals, and requirements through in-depth consultation.',
    details: ['Requirements gathering', 'Market research', 'Technical feasibility', 'Project scoping'],
  },
  {
    step: '02',
    title: 'Planning',
    description: 'Creating a roadmap with clear milestones, timelines, and deliverables.',
    details: ['Architecture design', 'Tech stack selection', 'Sprint planning', 'Resource allocation'],
  },
  {
    step: '03',
    title: 'Development',
    description: 'Building your solution with clean code, regular updates, and iterative feedback.',
    details: ['Agile methodology', 'Code reviews', 'Daily standups', 'Continuous integration'],
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Thorough testing, deployment, and ongoing support to ensure success.',
    details: ['QA testing', 'Performance optimization', 'Deployment', 'Maintenance & support'],
  },
];

const education = [
  {
    degree: 'Diploma in Computer Science',
    institution: 'Technical University of Mombasa',
    year: '2023-2025',
    description: 'Studied core areas including programming (PHP, JavaScript, and C++), database management systems, data structures and algorithms, computer networks, operating systems, software engineering, and web development. Gained practical experience through academic projects, system analysis, and application development.',
  },
  {
    degree: 'Software Development',
    institution: 'Power Learn Project',
    year: '2025',
    description: 'Completed hands-on training in full-stack software development, focusing on JavaScript, React, Node.js, databases, and real-world project development.',
  },
];

const certifications = [
  { name: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', year: '2024' },
  { name: 'React Developer Certificate', issuer: 'Meta (Coursera)', year: '2024' },
  { name: 'MongoDB Basics', issuer: 'Power Learn Project', year: '2025' },
];

const interests = [
  { icon: FiCoffee, label: 'Coffee Enthusiast', description: 'Fueled by espresso' },
  { icon: TbBallFootball, label: 'Footballer', description: 'Love the beautiful game' },
  { icon: FiCamera, label: 'Photography', description: 'Capturing moments' },
  { icon: FiGlobe, label: 'Travel', description: 'Exploring cultures' },
  { icon: FiBookOpen, label: 'Reading', description: 'Tech blogs & sci-fi' },
];

const timeline = [
  {
    year: '2025',
    title: 'Junior MERN Developer',
    description: 'Currently building full-stack applications and expanding my skills. Focused on writing clean code and learning best practices.',
    highlight: true,
    achievements: ['Built 8+ full-stack projects', 'Learning TypeScript', 'Contributing to open source'],
  },
  {
    year: '2024',
    title: 'Started MERN Journey',
    description: 'Began intensive learning of the MERN stack. Built my first full-stack applications and deployed them to production.',
    achievements: ['Completed React bootcamp', 'First Node.js API', 'Deployed first app to Vercel'],
  },
  {
    year: '2024',
    title: 'Web Development Foundations',
    description: 'Started with HTML, CSS, and JavaScript fundamentals. Built static websites and learned responsive design.',
    achievements: ['Mastered HTML & CSS', 'JavaScript fundamentals', 'Built portfolio website'],
  },
];

const socialLinks = [
  { name: 'GitHub', icon: FiGithub, href: 'https://github.com', color: 'hover:bg-gray-700' },
  { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com', color: 'hover:bg-blue-600' },
  { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
  { name: 'Email', icon: FiMail, href: 'mailto:hello@example.com', color: 'hover:bg-red-500' },
];

// Floating Shape Component
const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
    animate={{
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Counter Animation Hook
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };
    countRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(countRef.current);
  }, [end, duration, hasStarted]);

  return { count, setHasStarted };
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ stat, index }) => {
  const { count, setHasStarted } = useCountUp(stat.value);
  const IconComponent = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onViewportEnter={() => setHasStarted(true)}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center overflow-hidden hover:border-accent/30 transition-colors">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/5 to-transparent rounded-bl-full" />
        <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${stat.color} flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent size={26} />
        </div>
        <div className="text-5xl sm:text-6xl font-bold text-accent mb-2">
          {count}+
        </div>
        <div className="text-text-secondary text-sm font-medium uppercase tracking-wider">{stat.label}</div>
      </div>
    </motion.div>
  );
};

const About = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Floating Shapes */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Shapes */}
        <FloatingShape className="w-96 h-96 bg-accent/30 -top-20 -left-20" delay={0} />
        <FloatingShape className="w-72 h-72 bg-purple-500/20 top-40 right-0" delay={1} />
        <FloatingShape className="w-64 h-64 bg-cyan-500/20 bottom-0 left-1/3" delay={2} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image with Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex justify-center order-2 lg:order-1"
            >
              <TiltCard className="relative">
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-amber-400 to-accent blur-2xl opacity-30 animate-pulse" />
                
                {/* Main Image Container */}
                <div className="relative">
                  {/* Rotating Border */}
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-accent via-purple-500 to-accent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ padding: '3px' }}
                  />
                  
                  <div className="relative bg-bg-primary rounded-full p-1">
                    <Avatar
                      src="https://i.pinimg.com/1200x/f4/fc/01/f4fc018e3449a5ae18b534436a4203b3.jpg"
                      alt="Yahya Mohamed"
                      name="Yahya Mohamed"
                      className="w-64 h-64 sm:w-80 sm:h-80 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Status Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-bg-secondary/90 backdrop-blur-sm border border-accent/30 rounded-full px-6 py-2 shadow-lg shadow-accent/10"
                >
                  <Badge variant="success" dot>
                    Open to Opportunities
                  </Badge>
                </motion.div>
              </TiltCard>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Available for Work
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-text-primary">Hey, I'm</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent">
                  Yahya Mohamed
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-accent/80 font-medium mb-6">
                Full-Stack Developer specializing in the MERN stack.
              </p>
              
              <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-lg">
                Passionate about building web applications with the MERN stack. 
                Eager to learn, grow, and contribute to meaningful projects.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button className="group px-8">
                    <FiDownload className="w-5 h-5 group-hover:animate-bounce" />
                    Download Résumé
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" asChild>
                    <Link to="/contact" className="inline-flex items-center gap-2.5">
                      Let's Talk
                      <FiArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-bg-secondary/50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">By The Numbers</h2>
            <p className="text-text-secondary">A snapshot of my professional journey</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="py-24 relative">
        <FloatingShape className="w-64 h-64 bg-purple-500/10 top-20 right-10" delay={0.5} />
        
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">My Journey</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From curious beginner to confident developer, here's how my story unfolded
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex items-start gap-6 pb-12 last:pb-0"
              >
                {/* Timeline Line */}
                <div className="absolute left-[39px] top-20 bottom-0 w-px bg-gradient-to-b from-accent/50 to-transparent" />
                
                {/* Year Badge */}
                <div className={`
                  flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-lg
                  ${item.highlight 
                    ? 'bg-gradient-to-br from-accent to-amber-500 text-black' 
                    : 'bg-bg-secondary border border-border text-text-primary'
                  }
                `}>
                  {item.year}
                </div>
                
                {/* Content */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`
                    flex-1 p-6 rounded-2xl border transition-all duration-300
                    ${item.highlight 
                      ? 'bg-accent/5 border-accent/30 hover:border-accent/50' 
                      : 'bg-bg-secondary/50 border-border hover:border-accent/30'
                    }
                  `}
                >
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-text-secondary mb-4">{item.description}</p>
                  {item.achievements && (
                    <ul className="space-y-2">
                      {item.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                          <FiCheck className="text-accent flex-shrink-0" size={14} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-bg-secondary/50 relative overflow-hidden">
        <FloatingShape className="w-72 h-72 bg-accent/10 -top-10 -left-10" delay={0.3} />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tech Stack</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Technologies I work with to bring ideas to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Frontend */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-bg-primary/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <SiReact className="text-accent" size={18} />
                </span>
                Frontend
              </h3>
              <div className="space-y-4">
                {techStack.frontend.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <tech.icon className="text-text-secondary" size={18} />
                        <span className="text-sm font-medium">{tech.name}</span>
                      </div>
                      <span className="text-xs text-accent">{tech.level}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Backend */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-bg-primary/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <SiNodedotjs className="text-accent" size={18} />
                </span>
                Backend
              </h3>
              <div className="space-y-4">
                {techStack.backend.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <tech.icon className="text-text-secondary" size={18} />
                        <span className="text-sm font-medium">{tech.name}</span>
                      </div>
                      <span className="text-xs text-accent">{tech.level}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-bg-primary/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <SiGit className="text-accent" size={18} />
                </span>
                Tools & DevOps
              </h3>
              <div className="space-y-4">
                {techStack.tools.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <tech.icon className="text-text-secondary" size={18} />
                        <span className="text-sm font-medium">{tech.name}</span>
                      </div>
                      <span className="text-xs text-accent">{tech.level}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How I Work</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              A structured approach to delivering exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workProcess.map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Connector Line */}
                {index < workProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-accent/30 to-transparent z-0" />
                )}
                
                <div className="relative bg-bg-secondary/50 border border-border/50 rounded-2xl p-6 h-full hover:border-accent/30 transition-colors">
                  {/* Step Number */}
                  <div className="text-5xl font-bold text-accent/20 absolute top-4 right-4 group-hover:text-accent/30 transition-colors">
                    {process.step}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {process.description}
                  </p>
                  <ul className="space-y-2">
                    {process.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section className="py-24 bg-bg-secondary/50 relative overflow-hidden">
        <FloatingShape className="w-64 h-64 bg-accent/10 bottom-10 right-10" delay={0.7} />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Education & Certifications</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Continuous learning is at the heart of what I do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiBookOpen className="text-accent" />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.degree}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-bg-primary/60 border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold">{edu.degree}</h4>
                      <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-sm text-accent/70 mb-2">{edu.institution}</p>
                    <p className="text-sm text-text-secondary">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiAward className="text-accent" />
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-bg-primary/60 border border-border/50 rounded-xl p-4 hover:border-accent/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <FiAward className="text-accent" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{cert.name}</h4>
                      <p className="text-xs text-text-secondary">{cert.issuer}</p>
                    </div>
                    <span className="text-xs text-accent">{cert.year}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Interests Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Beyond The Code</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              When I'm not building applications, you'll find me...
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 bg-bg-secondary/50 border border-border/50 rounded-full px-6 py-3 hover:border-accent/30 transition-colors"
              >
                <interest.icon className="text-accent" size={20} />
                <div>
                  <span className="font-medium text-sm">{interest.label}</span>
                  <span className="text-text-secondary text-xs ml-2">• {interest.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-bg-secondary/50 relative overflow-hidden">
        <FloatingShape className="w-80 h-80 bg-accent/10 -bottom-20 -right-20" delay={1} />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What I Believe In</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              The principles that guide every line of code I write
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="h-full bg-bg-primary/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-500 hover:border-accent/30">
                  {/* Subtle Overlay on Hover */}
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Container */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${value.color} flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon size={28} />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 group-hover:text-accent transition-colors">{value.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let's Build Something Amazing</h2>
            <p className="text-text-secondary mb-10">
              Have a project in mind? Let's connect and bring your ideas to life.
            </p>

            <div className="flex justify-center gap-4 mb-12">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.15, y: -8, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-5 bg-bg-secondary border border-border rounded-2xl transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
                  aria-label={social.name}
                >
                  <social.icon size={26} />
                </motion.a>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button size="lg" className="px-10 py-4 text-base" asChild>
                <Link to="/contact" className="inline-flex items-center gap-2.5">
                  Start a Conversation
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
