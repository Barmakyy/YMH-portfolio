import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiExpress, 
  SiTypescript, SiTailwindcss, SiGit, SiDocker 
} from 'react-icons/si';

const skills = [
  { name: 'React', icon: SiReact, color: '#61DAFB', isCore: true },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933', isCore: true },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248', isCore: true },
  { name: 'Express', icon: SiExpress, color: '#ffffff', isCore: true },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', isCore: false },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', isCore: false },
  { name: 'Git', icon: SiGit, color: '#F05032', isCore: false },
  { name: 'Docker', icon: SiDocker, color: '#2496ED', isCore: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const SkillsSnapshot = () => {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tech Stack</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Technologies I work with to build modern, scalable applications
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`
                relative p-6 rounded-xl bg-bg-secondary border border-border
                flex flex-col items-center justify-center gap-3
                hover:border-accent/50 transition-colors cursor-default
                ${skill.isCore ? 'ring-2 ring-accent/20' : ''}
              `}
            >
              {skill.isCore && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-accent text-accent-contrast rounded-full">
                  Core
                </span>
              )}
              <skill.icon size={40} style={{ color: skill.color }} />
              <span className="text-sm font-medium text-text-primary">{skill.name}</span>
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
            to="/skills"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            See Full Skills
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSnapshot;
