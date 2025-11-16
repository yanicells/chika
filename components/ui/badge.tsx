import React from "react";

/**
 * Badge component for labels, tags, and status indicators
 *
 * @param variant - Badge style variant: 'default', 'primary', 'success', 'warning', or 'danger'
 * @param size - Badge size: 'sm', 'md', or 'lg'
 * @param children - Badge content
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", size = "md", children, className = "", ...props },
    ref
  ) => {
    const baseStyles = "inline-flex items-center font-medium rounded-md";

    const variantStyles = {
      default: "bg-surface1 text-text",
      primary: "bg-mauve text-base",
      success: "bg-green text-base",
      warning: "bg-peach text-base",
      danger: "bg-red text-base",
    };

    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const combinedClassName =
      `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
