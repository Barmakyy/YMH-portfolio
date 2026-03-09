import { forwardRef, useState } from 'react';

const Textarea = forwardRef(({ 
  label,
  error,
  helperText,
  maxLength,
  showCount = false,
  className = '',
  onChange,
  value,
  ...props 
}, ref) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 min-h-[120px]
            bg-bg-tertiary border border-border rounded-lg
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-all duration-200 resize-y
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {showCount && maxLength && (
          <span className="absolute bottom-3 right-3 text-xs text-text-muted">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-error' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
