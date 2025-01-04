import { ITask } from "../../../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: ITask[];
  onView: (task: ITask) => void;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, onView, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Task Name</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Status</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Priority</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Estimated Time</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Start Date</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">End Date</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onView={() => onView(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}; 