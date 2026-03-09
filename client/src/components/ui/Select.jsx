import { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
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
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-10
            bg-bg-tertiary border border-border rounded-lg
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-all duration-200
            appearance-none cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
            >
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-error' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
