import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiDatabase, FiLayers, FiServer, FiTool, FiUsers, FiZap, FiCode, FiTerminal } from 'react-icons/fi';
import { Badge } from '../components/ui';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiJavascript,
  SiTailwindcss, SiRedux, SiHtml5, SiCss3,
  SiGit, SiGithub, SiVercel, SiPostman, SiNpm,
  SiJsonwebtokens, SiJest,
  SiFigma, SiNotion
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { useState } from 'react';

// Skill data with more details
const coreStack = [
  { 
    name: 'MongoDB', 
    icon: SiMongodb, 
    letter: 'M',
    description: 'NoSQL database for flexible, scalable data storage',
    experience: '1 year',
    projects: 8,
    highlights: ['CRUD Operations', 'Schema Design', 'Mongoose ODM', 'Atlas Cloud'],
  },
  { 
    name: 'Express.js', 
    icon: SiExpress, 
    letter: 'E',
    description: 'Fast, minimalist web framework for Node.js',
    experience: '1 year',
    projects: 8,
    highlights: ['REST APIs', 'Middleware', 'Routing', 'Error Handling'],
  },
  { 
    name: 'React', 
    icon: SiReact, 
    letter: 'R',
    description: 'Component-based library for building user interfaces',
    experience: '1 year',
    projects: 10,
    highlights: ['Hooks', 'Context API', 'Component Design', 'State Management'],
  },
  { 
    name: 'Node.js', 
    icon: SiNodedotjs, 
    letter: 'N',
    description: 'JavaScript runtime for server-side development',
    experience: '1 year',
    projects: 8,
    highlights: ['npm/pnpm', 'File System', 'Environment Variables', 'APIs'],
  },
];

const skillCategories = [
  {
    title: 'Frontend Development',
    icon: FiLayers,
    description: 'Building responsive, interactive user interfaces with React and modern CSS',
    color: 'text-blue-400',
    skills: [
      { name: 'React', icon: SiReact, level: 70, years: 1 },
      { name: 'JavaScript', icon: SiJavascript, level: 75, years: 1 },
      { name: 'HTML5', icon: SiHtml5, level: 80, years: 1 },
      { name: 'CSS3', icon: SiCss3, level: 78, years: 1 },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 72, years: 1 },
      { name: 'Redux', icon: SiRedux, level: 55, years: '<1' },
    ],
    expertise: ['Component Architecture', 'Responsive Design', 'CSS Flexbox/Grid', 'React Hooks', 'Form Handling'],
  },
  {
    title: 'Backend Development',
    icon: FiServer,
    description: 'Building REST APIs and server-side applications with Node.js and Express',
    color: 'text-green-400',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, level: 68, years: 1 },
      { name: 'Express.js', icon: SiExpress, level: 70, years: 1 },
      { name: 'REST APIs', icon: SiJsonwebtokens, level: 72, years: 1 },
      { name: 'JWT Auth', icon: SiJsonwebtokens, level: 60, years: '<1' },
    ],
    expertise: ['API Design', 'Authentication', 'Middleware', 'Error Handling', 'Route Organization'],
  },
  {
    title: 'Database',
    icon: FiDatabase,
    description: 'Working with MongoDB for data storage and management',
    color: 'text-amber-400',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, level: 65, years: 1 },
      { name: 'Mongoose', icon: SiMongodb, level: 68, years: 1 },
    ],
    expertise: ['Schema Design', 'CRUD Operations', 'Data Modeling', 'Mongoose ODM', 'MongoDB Atlas'],
  },
  {
    title: 'Tools & Workflow',
    icon: FiTool,
    description: 'Development tools and version control for efficient workflow',
    color: 'text-purple-400',
    skills: [
      { name: 'Git', icon: SiGit, level: 70, years: 1 },
      { name: 'GitHub', icon: SiGithub, level: 72, years: 1 },
      { name: 'VS Code', icon: VscCode, level: 80, years: 1 },
      { name: 'Vercel', icon: SiVercel, level: 65, years: '<1' },
      { name: 'Postman', icon: SiPostman, level: 68, years: 1 },
    ],
    expertise: ['Version Control', 'Code Collaboration', 'API Testing', 'Deployment', 'Debugging'],
  },
];

const testingTools = [
  { name: 'Postman', icon: SiPostman, description: 'API Testing & Documentation' },
  { name: 'Jest', icon: SiJest, description: 'Learning Unit Testing' },
];

const workflowTools = [
  { name: 'VS Code', icon: VscCode, description: 'Primary IDE' },
  { name: 'GitHub', icon: SiGithub, description: 'Version Control' },
  { name: 'Figma', icon: SiFigma, description: 'Design Reference' },
  { name: 'Notion', icon: SiNotion, description: 'Notes & Planning' },
  { name: 'npm/pnpm', icon: SiNpm, description: 'Package Management' },
];

const softSkills = [
  { name: 'Problem Solving', description: 'Breaking down problems into smaller, manageable pieces', icon: FiCpu },
  { name: 'Eagerness to Learn', description: 'Always excited to explore new technologies and improve', icon: FiZap },
  { name: 'Attention to Detail', description: 'Careful about code quality and user experience', icon: FiCode },
  { name: 'Team Player', description: 'Open to feedback and collaboration with others', icon: FiUsers },
];

const learningQueue = [
  { name: 'TypeScript', progress: 35, target: 'Q2 2026' },
  { name: 'Next.js', progress: 25, target: 'Q2 2026' },
  { name: 'Testing (Jest/Cypress)', progress: 20, target: 'Q3 2026' },
  { name: 'Docker Basics', progress: 15, target: 'Q3 2026' },
  { name: 'PostgreSQL', progress: 10, target: 'Q4 2026' },
];

// Animated Skill Bar Component
const SkillBar = ({ skill, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onViewportEnter={() => setIsVisible(true)}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <skill.icon className="text-text-secondary group-hover:text-accent transition-colors" size={18} />
          <span className="text-sm font-medium">{skill.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary">{skill.years}y exp</span>
        </div>
      </div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${skill.level}%` : 0 }}
          transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

// MERN Card Component
const MernCard = ({ tech, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ y: -5 }}
        className="cursor-pointer bg-bg-secondary border border-border rounded-2xl p-6 hover:border-accent/30 transition-all"
      >
        {/* Letter Badge */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          <span className="text-2xl font-bold text-black">{tech.letter}</span>
        </div>
        
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-3">
            <tech.icon size={28} className="text-accent" />
            <h3 className="text-lg font-bold">{tech.name}</h3>
          </div>
          
          <p className="text-text-secondary text-sm mb-4">{tech.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
            <span className="flex items-center gap-1">
              <FiCode size={12} />
              {tech.experience}
            </span>
            <span className="flex items-center gap-1">
              <FiLayers size={12} />
              {tech.projects}+ projects
            </span>
          </div>
          
          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {tech.highlights.map((highlight) => (
              <span 
                key={highlight} 
                className="text-xs px-2 py-1 bg-bg-tertiary rounded-md text-text-secondary"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://i.pinimg.com/1200x/95/8b/5a/958b5a0c1e9799570020e370e6e9a4a7.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill"
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        {/* Gradient fade to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />

        <div className="container-custom relative z-10 text-center py-20">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <FiTerminal size={14} />
              Growing My Skills
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Skills & <span className="text-accent">Technologies</span>
            </h1>
            <p className="text-gray-200 max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              The technologies I've been learning and working with during my first year as a 
              software developer. Always eager to learn more!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="container-custom relative z-10 pt-16">

        {/* MERN Stack Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Core Stack: MERN</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              My primary focus - building full-stack JavaScript applications
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreStack.map((tech, index) => (
              <MernCard key={tech.name} tech={tech} index={index} />
            ))}
          </div>
        </section>

        {/* Skill Categories */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Technical Proficiency</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Detailed breakdown of skills across different domains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-bg-secondary/50 border border-border/50 rounded-2xl p-6 hover:border-accent/20 transition-colors"
              >
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center ${category.color}`}>
                    <category.icon size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{category.title}</h3>
                    <p className="text-text-secondary text-sm">{category.description}</p>
                  </div>
                </div>
                
                {/* Skills Grid */}
                <div className="space-y-4 mb-6">
                  {category.skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
                
                {/* Expertise Tags */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">Key Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {category.expertise.map((item) => (
                      <span 
                        key={item}
                        className="text-xs px-3 py-1.5 bg-bg-tertiary rounded-full text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testing & Quality Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Testing & Quality Assurance</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Ensuring code quality and reliability through comprehensive testing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testingTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-bg-secondary/50 border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-all"
              >
                <tool.icon size={28} className="text-accent mb-3" />
                <h4 className="font-bold mb-1">{tool.name}</h4>
                <p className="text-text-secondary text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Workflow & Tools */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Development Workflow</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Tools that power my daily development process
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {workflowTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-5 py-3 bg-bg-secondary/50 border border-border/50 rounded-xl hover:border-accent/30 transition-all"
              >
                <tool.icon size={20} className="text-accent" />
                <div>
                  <span className="font-medium text-sm">{tool.name}</span>
                  <span className="text-text-secondary text-xs ml-2">• {tool.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Soft Skills */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Beyond Technical Skills</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              The soft skills that complement my technical expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-bg-secondary/50 border border-border/50 rounded-2xl p-6 text-center hover:border-accent/30 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neutral-800 border border-accent/20 flex items-center justify-center text-accent">
                  <skill.icon size={24} />
                </div>
                <h4 className="font-bold mb-2">{skill.name}</h4>
                <p className="text-text-secondary text-sm">{skill.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learning Queue */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-secondary/30 border border-border/50 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FiZap className="text-accent" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Learning Queue</h2>
                <p className="text-text-secondary text-sm">Technologies I'm currently exploring</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningQueue.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-primary/50 border border-border/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-accent/50 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary">Target: {item.target}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-accent/5 border border-accent/20 rounded-2xl p-12"
        >
          <h3 className="text-2xl font-bold mb-4">See These Skills in Action</h3>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Browse through my portfolio to see real-world applications built with these technologies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent text-accent-contrast font-semibold rounded-full shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 hover:brightness-110 transition-all duration-300 hover:scale-[1.02]"
              >
                View Projects
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-transparent border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-accent-contrast hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 hover:scale-[1.02]"
              >
                Get in Touch
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
