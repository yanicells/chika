import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export default function Container({
  children,
  size = "xl",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto px-4 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
