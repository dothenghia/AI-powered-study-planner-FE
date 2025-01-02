import { cn } from "../../utils/cn";
import { Tag } from "./Tag";

type Status = "Todo" | "In Progress" | "Completed" | "Expired";

interface StatusTagProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { color: string }> = {
  "Todo": { color: "yellow" },
  "In Progress": { color: "blue" },
  "Completed": { color: "green" },
  "Expired": { color: "default" },
};

export const StatusTag = ({ status, className }: StatusTagProps) => {
  const config = statusConfig[status];
  const colorMap = {
    yellow: "#efa91b",
    blue: "#1777ff",
    green: "#389e0e",
    default: "#555555"
  };

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
