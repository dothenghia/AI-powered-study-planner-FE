import { cn } from "../../utils/cn";
import { COLORS } from "../../constants/colors";

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
      bg: `bg-[${COLORS.TAG_DEFAULT_BG}]`,
      text: `text-[${COLORS.TAG_DEFAULT_TEXT}]`,
      border: `border-[${COLORS.TAG_DEFAULT_BORDER}]`
    },
    blue: {
      bg: `bg-[${COLORS.TAG_BLUE_BG}]`,
      text: `text-[${COLORS.TAG_BLUE_TEXT}]`,
      border: `border-[${COLORS.TAG_BLUE_BORDER}]`
    },
    green: {
      bg: `bg-[${COLORS.TAG_GREEN_BG}]`,
      text: `text-[${COLORS.TAG_GREEN_TEXT}]`,
      border: `border-[${COLORS.TAG_GREEN_BORDER}]`
    },
    red: {
      bg: `bg-[${COLORS.TAG_RED_BG}]`,
      text: `text-[${COLORS.TAG_RED_TEXT}]`,
      border: `border-[${COLORS.TAG_RED_BORDER}]`
    },
    yellow: {
      bg: `bg-[${COLORS.TAG_YELLOW_BG}]`,
      text: `text-[${COLORS.TAG_YELLOW_TEXT}]`,
      border: `border-[${COLORS.TAG_YELLOW_BORDER}]`
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
