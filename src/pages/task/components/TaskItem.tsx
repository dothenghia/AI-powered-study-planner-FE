import { ITask } from "../../../types/task";
import { Button } from "../../../components/ui/Button";
import { formatDate } from "../../../utils/date";

interface TaskItemProps {
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const statusColors = {
    Todo: "bg-orange-400",
    "In Progress": "bg-blue-500",
    Completed: "bg-green-500",
    Expired: "bg-gray-500",
  };

  const priorityColors = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };

  return (
    <li className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{task.name}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-medium ${priorityColors[task.priority]}`}>
              {task.priority} Priority
            </span>
            <span className={`px-2 py-1 rounded-full text-white ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Start: {formatDate(task.opened_at || "")}</p>
            <p>Due: {formatDate(task.dued_at || "")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="secondary" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}; 