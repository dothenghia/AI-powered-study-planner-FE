import { ITask } from "../../../types/task";
import { Button } from "../../../components/ui/Button";
import { formatDate } from "../../../utils/date";
import { PenSquare, Trash2 } from "lucide-react";
import { PriorityTag } from "../../../components/ui/PriorityTag";
import { StatusTag } from "../../../components/ui/StatusTag";

interface TaskItemProps {
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  return (
    <li className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{task.name}</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <span>{formatDate(task.opened_at || "")} → {formatDate(task.dued_at || "")}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <StatusTag status={task.status} />
            <PriorityTag priority={task.priority} />
          </div>
          <p className="text-gray-600">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>
            <PenSquare />
          </Button>
          <Button variant="secondary" onClick={onDelete}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  );
}; 