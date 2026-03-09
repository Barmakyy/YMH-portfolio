const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-xl',
  '2xl': 'w-32 h-32 text-2xl',
};

const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`
          ${sizes[size]} 
          rounded-full object-cover
          border-2 border-border
          ${className}
        `}
        {...props}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        bg-accent/20 text-amber-600 dark:text-accent
        flex items-center justify-center
        font-bold border-2 border-border
        ${className}
      `}
      {...props}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
