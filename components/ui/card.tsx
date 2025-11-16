import React from 'react';

/**
 * Card component for displaying content in a contained box
 * 
 * @param header - Optional header content
 * @param footer - Optional footer content
 * @param children - Main card content
 * @param padding - Padding variant: 'sm', 'md', or 'lg'
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ header, footer, padding = 'md', children, className = '', ...props }, ref) => {
    const paddingStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    const baseStyles = 'bg-white border border-gray-200 rounded-lg shadow-sm';
    const combinedClassName = `${baseStyles} ${className}`.trim();
    
    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {header && (
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
            {header}
          </div>
        )}
        <div className={paddingStyles[padding]}>
          {children}
        </div>
        {footer && (
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

