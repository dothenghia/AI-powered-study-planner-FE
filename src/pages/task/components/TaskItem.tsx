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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <span className="font-medium">{task.name}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center">
          <StatusTag status={task.status} />
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center">
          <PriorityTag priority={task.priority} />
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        {task.estimated_time}
      </td>
      <td className="px-6 py-4 text-center">
        {formatDate(task.opened_at || "")}
      </td>
      <td className="px-6 py-4 text-center">
        {formatDate(task.dued_at || "")}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-xs truncate" title={task.description}>
          {task.description}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>
            <PenSquare className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}; 