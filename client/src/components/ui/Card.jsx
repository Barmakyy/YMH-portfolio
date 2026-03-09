import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  padding = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px -20px rgba(59, 130, 246, 0.15)' } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        bg-bg-secondary rounded-xl border border-border
        shadow-sm dark:shadow-none
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:border-accent/30 hover:shadow-md dark:hover:shadow-none transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-text-primary ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-text-secondary mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-border ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
