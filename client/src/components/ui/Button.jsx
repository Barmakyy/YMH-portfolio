import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-accent text-accent-contrast font-semibold shadow-md shadow-accent/25 hover:brightness-110 hover:shadow-lg hover:shadow-accent/30',
  secondary: 'bg-bg-tertiary hover:bg-border-light text-text-primary border border-border',
  ghost: 'bg-transparent hover:bg-bg-tertiary text-text-primary',
  destructive: 'bg-error hover:bg-error/80 text-white',
  outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-accent-contrast hover:shadow-lg hover:shadow-accent/25',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  asChild = false,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 
    font-semibold rounded-full
    transition-all duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
