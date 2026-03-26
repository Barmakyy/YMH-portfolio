import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Avatar } from '../ui';

const AboutTeaser = () => {
  return (
    <section className="py-20 bg-bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Avatar
                src="https://i.pinimg.com/1200x/f4/fc/01/f4fc018e3449a5ae18b534436a4203b3.jpg"
                alt="Developer"
                name="Developer"
                size="2xl"
                className="border-4 border-accent/20"
              />
              {/* Decorative Ring */}
              <div className="absolute inset-0 border-2 border-accent/30 rounded-full scale-110 animate-pulse" />
              <div className="absolute inset-0 border border-accent/20 rounded-full scale-125" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About <span className="text-accent">Me</span>
            </h2>
            
            <p className="text-text-secondary text-lg leading-relaxed mb-3">
              I'm a passionate Full-Stack Developer specializing in the MERN stack. 
              With a deep understanding of both frontend and backend technologies, 
              I create seamless, scalable web applications that solve real-world problems.
            </p>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              My journey in software development started with a curiosity about how things 
              work. Today, that curiosity drives me to continuously learn and push the 
              boundaries of what's possible with modern web technologies.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
            >
              Read More About Me
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
