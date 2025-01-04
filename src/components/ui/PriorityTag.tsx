import { Tag } from "./Tag";
import { ChevronUp, ChevronDown, Equal } from "lucide-react";
import { Priority, PRIORITY } from "../../types/common";

interface PriorityTagProps {
  priority: Priority;
  className?: string;
}

const priorityConfig = {
  [PRIORITY.HIGH]: {
    color: "red",
    icon: <ChevronUp className="w-4 h-4" />
  },
  [PRIORITY.MEDIUM]: {
    color: "yellow",
    icon: <Equal className="w-4 h-4" />
  },
  [PRIORITY.LOW]: {
    color: "green",
    icon: <ChevronDown className="w-4 h-4" />
  },
}

export const PriorityTag = ({ priority, className }: PriorityTagProps) => {
  const config = priorityConfig[priority];

  return (
    <Tag
      color={config.color}
      className={className}
      bordered
    >
      {config.icon}
      {priority}
    </Tag>
  );
};
