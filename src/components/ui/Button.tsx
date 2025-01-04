import { forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "filled" | "gray" | "default";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", isLoading, className, ...props }, ref) => {
    const baseStyles = "rounded-lg px-4 h-10 transition-colors duration-300";
    
    // Define button styles based on variant
    const variants = {
      primary: "bg-primary hover:bg-primary-hover text-white",
      outline: "border-2 border-primary text-primary hover:border-primary-hover hover:text-primary-hover",
      filled: "bg-primary-background text-primary hover:bg-primary-background-hover hover:text-primary-hover",
      default: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2",
      gray: "bg-gray-100 hover:bg-gray-200 text-gray-700"
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          isLoading && "opacity-70 cursor-not-allowed",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
); 