import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "../../components/forms/TaskForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useTasks } from "../../hooks/useTasks";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";
import { ITask } from "../../types/task";
import { taskSchema } from "../../utils/validations";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../../stores";

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortPriorityAsc, setSortPriorityAsc] = useState(true);
  const [sortStatusAsc, setSortStatusAsc] = useState(true);
  const { userId } = useAuthStore();

  const { tasks, isLoading, createTask, updateTask, deleteTask, fetchTasks } = useTasks();
  const { isAnalyzing, analyzeWithAI } = useAIAnalysis();

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, []);

  const form = useForm<Partial<ITask>>({
    resolver: yupResolver(taskSchema),
    defaultValues: editingTask || {
      name: "",
      description: "",
      priority: "Medium",
      status: "Todo",
      estimated_time: 0,
      opened_at: new Date().toISOString().slice(0, 16),
      dued_at: new Date().toISOString().slice(0, 16),
    },
  });

  const handleSubmit = async (data: Partial<ITask>) => {
    const formattedData = {
      ...data,
      estimated_time: data.estimated_time ? Math.round(Number(data.estimated_time)) : undefined
    };

    if (editingTask) {
      await updateTask(editingTask.id, formattedData);
    } else {
      await createTask(formattedData);
    }
    setShowModal(false);
    setEditingTask(null);
    form.reset();
  };

  const handleEdit = (task: ITask) => {
    setEditingTask(task);
    form.reset({
      ...task,
      opened_at: task.opened_at ? new Date(task.opened_at).toISOString().slice(0, 16) : "",
      dued_at: task.dued_at ? new Date(task.dued_at).toISOString().slice(0, 16) : "",
    });
    setShowModal(true);
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!priorityFilter || task.priority === priorityFilter) &&
      (!statusFilter || task.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortPriorityAsc) {
        return a.priority.localeCompare(b.priority);
      }
      return b.priority.localeCompare(a.priority);
    });

  return (
    <div className="min-h-full p-6">
      <ToastContainer />

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <div className="space-x-4">
            <Button
              variant="primary"
              onClick={() => {
                setEditingTask(null);
                form.reset({
                  name: "",
                  description: "",
                  priority: "Medium",
                  status: "Todo",
                  estimated_time: 0,
                  opened_at: new Date().toISOString().slice(0, 16),
                  dued_at: new Date().toISOString().slice(0, 16),
                });
                setShowModal(true);
              }}
            >
              Add Task
            </Button>
            <Button
              variant="secondary"
              onClick={analyzeWithAI}
              isLoading={isAnalyzing}
            >
              ✨ Analyse with AI
            </Button>
          </div>
        </div>

        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSortPriority={() => setSortPriorityAsc(!sortPriorityAsc)}
          onSortStatus={() => setSortStatusAsc(!sortStatusAsc)}
          sortPriorityAsc={sortPriorityAsc}
          sortStatusAsc={sortStatusAsc}
        />

        {isLoading ? (
          <div className="text-center py-10">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          title={editingTask ? "Edit Task" : "Create Task"}
          hideFooter
        >
          <TaskForm
            form={form}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
            isEditing={!!editingTask}
          />
        </Modal>
      </div>
    </div>
  );
} 