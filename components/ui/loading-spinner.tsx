import React from 'react';

/**
 * Loading spinner component for indicating loading states
 * 
 * @param size - Spinner size: 'sm', 'md', or 'lg'
 * @param className - Additional CSS classes
 */
interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', className = '', ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };
    
    const borderStyles = {
      sm: 'border-2',
      md: 'border-2',
      lg: 'border-4',
    };
    
    const combinedClassName = `inline-block animate-spin rounded-full border-solid border-blue-600 border-t-transparent ${sizeStyles[size]} ${borderStyles[size]} ${className}`.trim();
    
    return (
      <div
        ref={ref}
        className={combinedClassName}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;

