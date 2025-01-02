import { Tag } from "./Tag";
import { ChevronUp, ChevronDown, Equal } from "lucide-react";

type Priority = "High" | "Medium" | "Low";

interface PriorityTagProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { 
  color: string;
  icon: React.ReactNode;
}> = {
  High: { 
    color: "red",
    icon: <ChevronUp className="w-4 h-4" />
  },
  Medium: { 
    color: "yellow",
    icon: <Equal className="w-4 h-4" />
  },
  Low: { 
    color: "green",
    icon: <ChevronDown className="w-4 h-4" />
  },
};

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
