import { UseFormReturn } from "react-hook-form";
import { ITask } from "../../types/task";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { STATUS, PRIORITY } from "../../types/common";

interface TaskFormProps {
  form: UseFormReturn<Partial<ITask>>;
  onSubmit: (data: Partial<ITask>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const TaskForm = ({ form, onSubmit, onCancel, isEditing }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  // Define priority options
  const priorityOptions = [
    { value: PRIORITY.HIGH, label: PRIORITY.HIGH },
    { value: PRIORITY.MEDIUM, label: PRIORITY.MEDIUM },
    { value: PRIORITY.LOW, label: PRIORITY.LOW },
  ];

  // Define status options
  const statusOptions = [
    { value: STATUS.TODO, label: STATUS.TODO },
    { value: STATUS.IN_PROGRESS, label: STATUS.IN_PROGRESS },
    { value: STATUS.COMPLETED, label: STATUS.COMPLETED },
    { value: STATUS.EXPIRED, label: STATUS.EXPIRED },
  ];

  return (
    <form id="modal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-500">Task Name</label>
        <Input
          {...register("name")}
          placeholder="Enter task name"
          error={errors.name?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-500">Description</label>
        <Input
          {...register("description")}
          placeholder="Enter task description"
          as="textarea"
          rows={3}
          error={errors.description?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500">Priority</label>
          <Select
            {...register("priority")}
            options={priorityOptions}
            error={errors.priority?.message}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500">Status</label>
          <Select
            {...register("status")}
            options={statusOptions}
            error={errors.status?.message}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-500">Estimated Time (minutes)</label>
        <Input
          {...register("estimated_time")}
          type="number"
          placeholder="Enter estimated time in minutes (1-1440)"
          error={errors.estimated_time?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500">Start Date</label>
          <Input
            {...register("opened_at")}
            type="datetime-local"
            error={errors.opened_at?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-500">Due Date</label>
          <Input
            {...register("dued_at")}
            type="datetime-local"
            error={errors.dued_at?.message}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button variant="gray" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditing ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  );
};
