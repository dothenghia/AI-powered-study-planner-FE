import { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, className, as = "input", ...props }, ref) => {
    const Component = as;
    
    return (
      <div className="mb-4">
        <Component
          ref={ref as any}
          className={clsx(
            "block w-full rounded-md border p-2 focus:outline-none focus:ring-1",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 mt-1">{error}</span>
        )}
      </div>
    );
  }
); 