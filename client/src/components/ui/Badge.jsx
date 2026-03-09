const variants = {
  default: 'bg-bg-tertiary text-text-primary border-border',
  accent: 'bg-accent/20 text-amber-700 dark:text-accent border-accent/40',
  success: 'bg-success/15 text-green-700 dark:text-success border-success/40',
  warning: 'bg-warning/15 text-amber-700 dark:text-warning border-warning/40',
  error: 'bg-error/15 text-red-700 dark:text-error border-error/40',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${variant === 'success' ? 'bg-success' :
            variant === 'warning' ? 'bg-warning' :
              variant === 'error' ? 'bg-error' :
                variant === 'accent' ? 'bg-accent' : 'bg-text-muted'
          }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
