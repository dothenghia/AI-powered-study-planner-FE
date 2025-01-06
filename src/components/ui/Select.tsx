import { forwardRef } from "react";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, options, ...props }, ref) => {
    return (
      <>
        <select
          ref={ref}
          className={clsx(
            "block rounded-lg border px-4 h-10 focus:outline-none focus:ring-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400",
            className
          )}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value} className="dark:bg-gray-800">
              {label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</span>
        )}
      </>
    );
  }
);
