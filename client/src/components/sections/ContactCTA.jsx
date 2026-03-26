import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '../ui';

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 mb-4 text-sm font-medium text-accent bg-accent/10 rounded-full border border-accent/30"
          >
            🚀 Open to New Opportunities
          </motion.span>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Let's Build Something{' '}
            <span className="text-gradient">Amazing</span> Together
          </h2>

          {/* Description */}
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Whether you have a project in mind, need a developer for your team, 
            or just want to connect — I'd love to hear from you.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" asChild>
              <Link to="/contact" className="inline-flex items-center gap-2">
                Get in Touch
                <FiArrowRight />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
