import { UseFormReturn } from "react-hook-form";
import { ITask } from "../../types/task";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface TaskFormProps {
  form: UseFormReturn<Partial<ITask>>;
  onSubmit: (data: Partial<ITask>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const TaskForm = ({ form, onSubmit, onCancel, isEditing }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const statusOptions = [
    { value: "Todo", label: "Todo" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Expired", label: "Expired" },
  ];

  return (
    <form id="modal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name")}
        placeholder="Task Name"
        error={errors.name?.message}
      />

      <Input
        {...register("description")}
        placeholder="Description"
        as="textarea"
        rows={3}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          {...register("priority")}
          options={priorityOptions}
          error={errors.priority?.message}
        />

        <Select
          {...register("status")}
          options={statusOptions}
          error={errors.status?.message}
        />

        <Input
          {...register("opened_at")}
          type="datetime-local"
          error={errors.opened_at?.message}
        />

        <Input
          {...register("dued_at")}
          type="datetime-local"
          error={errors.dued_at?.message}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  );
};
