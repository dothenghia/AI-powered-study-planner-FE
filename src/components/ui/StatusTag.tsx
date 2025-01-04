import { cn } from "../../utils/cn";
import { Tag } from "./Tag";
import { Status, STATUS } from "../../types/common";
import { COLORS } from "../../constants/colors";

interface StatusTagProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  [STATUS.TODO]: { color: "yellow" },
  [STATUS.IN_PROGRESS]: { color: "blue" },
  [STATUS.COMPLETED]: { color: "green" },
  [STATUS.EXPIRED]: { color: "default" },
}

export const StatusTag = ({ status, className }: StatusTagProps) => {
  const config = statusConfig[status];
  const colorMap = {
    yellow: COLORS.STATUS_TODO,
    blue: COLORS.STATUS_IN_PROGRESS,
    green: COLORS.STATUS_COMPLETED,
    default: COLORS.STATUS_EXPIRED
  }

  return (
    <Tag
      customColors={{
        background: colorMap[config.color as keyof typeof colorMap],
        text: "#ffffff",
        border: colorMap[config.color as keyof typeof colorMap]
      }}
      className={cn(className, "!px-3 !rounded-full")}
    >
      {status}
    </Tag>
  );
};
