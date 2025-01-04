import { cn } from "../../utils/cn";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  bordered?: boolean;
  className?: string;
  children?: React.ReactNode;
  customColors?: {
    background?: string;
    text?: string;
    border?: string;
  };
}

const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-300'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-300'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    border: 'border-yellow-300'
  }
};

export const Tag = ({ 
  color = "default", 
  bordered = false, 
  className,
  children,
  customColors,
  ...props 
}: TagProps) => {
  const getColorClasses = () => {
    if (customColors) {
      return {
        bg: customColors.background ? `!bg-[${customColors.background}]` : "",
        text: customColors.text ? `!text-[${customColors.text}]` : "",
        border: customColors.border ? `!border-[${customColors.border}]` : ""
      };
    }
    return colorMap[color] || colorMap.default;
  };

  const { bg, text, border } = getColorClasses();

  return (
    <span
      style={{
        backgroundColor: customColors?.background,
        color: customColors?.text,
        borderColor: customColors?.border
      }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md",
        bg,
        text,
        bordered && `border ${border}`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
