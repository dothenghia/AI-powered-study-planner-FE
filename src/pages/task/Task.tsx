import { useState } from "react";
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

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortPriorityAsc, setSortPriorityAsc] = useState(true);
  const [sortStatusAsc, setSortStatusAsc] = useState(true);

  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const { isAnalyzing, analyzeWithAI } = useAIAnalysis();

  const form = useForm<Partial<ITask>>({
    resolver: yupResolver(taskSchema),
    defaultValues: editingTask || {
      name: "",
      description: "",
      priority: "Medium",
      status: "Todo",
    },
  });

  const handleSubmit = async (data: Partial<ITask>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setShowModal(false);
    setEditingTask(null);
    form.reset();
  };

  const handleEdit = (task: ITask) => {
    setEditingTask(task);
    form.reset(task);
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
    <div className="min-h-full bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <div className="space-x-4">
            <Button onClick={() => setShowModal(true)}>
              Add Task
            </Button>
            <Button 
              variant="secondary" 
              onClick={analyzeWithAI}
              isLoading={isAnalyzing}
            >
              ★ Analyse with AI
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
            setEditingTask(null);
            form.reset();
          }}
          title={editingTask ? "Edit Task" : "Create Task"}
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