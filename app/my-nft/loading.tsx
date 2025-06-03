import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "blue" | "emerald" | "purple" | "custom";
  customColor?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "primary",
  customColor,
  className = "",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  // Color classes (dark mode compatible)
  const colorClasses = {
    primary:
      "border-t-transparent border-b-primary-500/20 border-l-primary-500/20 border-r-primary-500/20 dark:border-b-primary-400/20 dark:border-l-primary-400/20 dark:border-r-primary-400/20",
    white:
      "border-t-transparent border-b-white/20 border-l-white/20 border-r-white/20",
    blue: "border-t-transparent border-b-blue-500/20 border-l-blue-500/20 border-r-blue-500/20 dark:border-b-blue-400/20 dark:border-l-blue-400/20 dark:border-r-blue-400/20",
    emerald:
      "border-t-transparent border-b-emerald-500/20 border-l-emerald-500/20 border-r-emerald-500/20 dark:border-b-emerald-400/20 dark:border-l-emerald-400/20 dark:border-r-emerald-400/20",
    purple:
      "border-t-transparent border-b-purple-500/20 border-l-purple-500/20 border-r-purple-500/20 dark:border-b-purple-400/20 dark:border-l-purple-400/20 dark:border-r-purple-400/20",
    custom: "",
  };

  // Custom color style
  const customStyle =
    color === "custom"
      ? {
          borderColor: customColor ? `${customColor}20` : "transparent",
          borderTopColor: "transparent",
        }
      : {};

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        style={customStyle}
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
