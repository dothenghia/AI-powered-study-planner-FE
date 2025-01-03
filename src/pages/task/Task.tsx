import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingIndicator from "react-loading-indicator";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "../../components/forms/TaskForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useTasks } from "../../hooks/useTasks";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";
import { ITask } from "../../types/task";
import { taskSchema } from "../../utils/validations";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../../stores";

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortPriorityAsc, setSortPriorityAsc] = useState<boolean | null>(null);
  const [sortStatusAsc, setSortStatusAsc] = useState<boolean | null>(null);
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

  const priorityOrder = sortPriorityAsc ? ["Low", "Medium", "High"] : ["High", "Medium", "Low"];
  const statusOrder = sortStatusAsc ? ["Todo", "In Progress", "Completed", "Expired"] : ["Completed", "In Progress", "Todo", "Expired"];

  const filteredTasks = tasks
    .filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!priorityFilter || task.priority === priorityFilter) &&
      (!statusFilter || task.status === statusFilter)
    )
    .sort((a, b) => {
      // Sort by priority if priority sort is active
      if (sortPriorityAsc !== null) {
        const priorityA = priorityOrder.indexOf(a.priority);
        const priorityB = priorityOrder.indexOf(b.priority);
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      }

      // Sort by status if status sort is active
      if (sortStatusAsc !== null) {
        const statusA = statusOrder.indexOf(a.status);
        const statusB = statusOrder.indexOf(b.status);
        if (statusA !== statusB) {
          return statusA - statusB;
        }
      }

      return 0;
    });

  // Toggle sort functions
  const togglePrioritySort = () => {
    if (sortPriorityAsc === null) {
      setSortPriorityAsc(true);
    } else if (sortPriorityAsc) {
      setSortPriorityAsc(false);
    } else {
      setSortPriorityAsc(null);
    }
    // Reset status sort when priority sort changes
    setSortStatusAsc(null);
  };

  const toggleStatusSort = () => {
    if (sortStatusAsc === null) {
      setSortStatusAsc(true);
    } else if (sortStatusAsc) {
      setSortStatusAsc(false);
    } else {
      setSortStatusAsc(null);
    }
    // Reset priority sort when status sort changes
    setSortPriorityAsc(null);
  };

  return (
    <div className="min-h-full p-6">
      <ToastContainer
        position="top-center"
        autoClose={2345}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        toastClassName={"w-fit px-5 !min-h-14"}
        closeButton={false}
      />

      <div className="mx-auto">
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
          onSortPriority={togglePrioritySort}
          onSortStatus={toggleStatusSort}
          sortPriorityAsc={sortPriorityAsc}
          sortStatusAsc={sortStatusAsc}
        />

        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingIndicator />
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          )}
        </div>

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