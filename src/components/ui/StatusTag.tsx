import { cn } from "../../utils/cn";
import { Tag } from "./Tag";
import { Status, STATUS } from "../../types/common";

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
    yellow: "#efa91b",
    blue: "#1777ff",
    green: "#389e0e",
    default: "#888888"
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
