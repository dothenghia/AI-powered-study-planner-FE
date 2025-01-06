import { ITask } from "../../../types/task";
import { Button } from "../../../components/ui/Button";
import { formatDate } from "../../../utils/date";
import { PenSquare, Trash2 } from "lucide-react";
import { PriorityTag } from "../../../components/ui/PriorityTag";
import { StatusTag } from "../../../components/ui/StatusTag";

interface TaskItemProps {
  task: ITask;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onView, onEdit, onDelete }: TaskItemProps) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={onView}>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-900 dark:text-gray-100">{task.name}</span>
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
      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
        {task.estimated_time}
      </td>
      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
        {formatDate(task.opened_at || "")}
      </td>
      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
        {formatDate(task.dued_at || "")}
      </td>
      <td className="px-6 py-4">
        <div className="max-w-xs truncate text-gray-700 dark:text-gray-300" title={task.description}>
          {task.description}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button variant="filled" onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
            <PenSquare className="w-4 h-4" />
          </Button>
          <Button variant="filled" onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}; 