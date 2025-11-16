import React, { useId } from 'react';

/**
 * Input component for text, email, password, and other input types
 * 
 * @param label - Optional label text displayed above the input
 * @param error - Error message to display below the input
 * @param type - Input type (text, email, password, etc.)
 * @param placeholder - Placeholder text
 * @param disabled - Disables the input
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    const baseStyles = 'w-full px-3 py-2 text-base text-gray-900 bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const borderStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    
    const combinedClassName = `${baseStyles} ${borderStyles} ${className}`.trim();
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

