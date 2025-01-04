import { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ error, className, as = "input", rows = 4, ...props }, ref) => {
    const Component = as;

    return (
      <>
        <Component
          ref={ref as any}
          className={clsx(
            "block w-full rounded-lg border px-4 h-10 focus:outline-none focus:ring-1",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            as === "textarea" && "h-auto py-2",
            className
          )}
          rows={as === "textarea" ? rows : undefined}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 mt-1">{error}</span>
        )}
      </>
    );
  }
); 