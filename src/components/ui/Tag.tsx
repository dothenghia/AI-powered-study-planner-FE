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

export const Tag = ({ 
  color = "default", 
  bordered = false, 
  className,
  children,
  customColors,
  ...props 
}: TagProps) => {
  const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
    default: {
      bg: "bg-[#f6f6f6]",
      text: "text-[#555555]",
      border: "border-[#d9d9d9]"
    },
    blue: {
      bg: "bg-[#e6f4ff]",
      text: "text-[#1777ff]",
      border: "border-[#91caff]"
    },
    green: {
      bg: "bg-[#f6ffed]",
      text: "text-[#389e0e]",
      border: "border-[#b8ea8f]"
    },
    red: {
      bg: "bg-[#fff2f0]",
      text: "text-[#cf1421]",
      border: "border-[#ffccc6]"
    },
    yellow: {
      bg: "bg-[#fff9d1]",
      text: "text-[#dc9c17]",
      border: "border-[#fedc78]"
    }
  };

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
