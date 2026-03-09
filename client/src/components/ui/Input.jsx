import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3
          bg-bg-tertiary border border-border rounded-lg
          text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-error' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
