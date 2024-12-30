import { ITask } from "../../../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </ul>
  );
}; 