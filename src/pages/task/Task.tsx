import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingIndicator from "react-loading-indicator";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "../../components/forms/TaskForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { PriorityTag } from "../../components/ui/PriorityTag";
import { StatusTag } from "../../components/ui/StatusTag";
import { useTasks } from "../../hooks/useTasks";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";
import { ITask } from "../../types/task";
import { taskSchema } from "../../utils/validations";
import { formatDate } from "../../utils/date";
import { useAuthStore } from "../../stores";
import Markdown from "react-markdown";
import { STATUS, PRIORITY } from "../../types/common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/constants";
import { Sparkles } from "lucide-react";

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [viewingTask, setViewingTask] = useState<ITask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortPriorityAsc, setSortPriorityAsc] = useState<boolean | null>(null);
  const [sortStatusAsc, setSortStatusAsc] = useState<boolean | null>(null);
  const { userId, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { tasks, isLoading, createTask, updateTask, deleteTask, fetchTasks } = useTasks();
  const { isAnalyzing, analysisResult, analyzeWithAI } = useAIAnalysis();

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, []);

  // Initialize form with yup validation
  const form = useForm<Partial<ITask>>({
    resolver: yupResolver(taskSchema),
    defaultValues: editingTask || {
      name: "",
      description: "",
      priority: PRIORITY.MEDIUM,
      status: STATUS.TODO,
      estimated_time: 0,
      opened_at: new Date().toLocaleString('sv-SE').slice(0, 16),
      dued_at: new Date().toLocaleString('sv-SE').slice(0, 16),
    },
  });

  // Handle form submission
  const handleSubmit = async (data: Partial<ITask>) => {
    const formattedData = {
      ...data,
      estimated_time: data.estimated_time ? Math.round(Number(data.estimated_time)) : 30
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

  // Handle edit task
  const handleEdit = (task: ITask) => {
    setEditingTask(task);
    form.reset({
      ...task,
      opened_at: task.opened_at ? new Date(task.opened_at).toISOString().slice(0, 16) : "",
      dued_at: task.dued_at ? new Date(task.dued_at).toISOString().slice(0, 16) : "",
    });
    setShowModal(true);
  };

  const handleView = (task: ITask) => {
    setViewingTask(task);
    setShowViewModal(true);
  };

  // Define priority order
  const priorityOrder = sortPriorityAsc
    ? [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH]
    : [PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW];

  // Define status order
  const statusOrder = sortStatusAsc
    ? [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.COMPLETED, STATUS.EXPIRED]
    : [STATUS.COMPLETED, STATUS.IN_PROGRESS, STATUS.TODO, STATUS.EXPIRED];

  // Filter tasks based on search term, priority, and status
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

      // Default sort by opened_at in descending order
      const timeA = a.opened_at ? new Date(a.opened_at).getTime() : 0;
      const timeB = b.opened_at ? new Date(b.opened_at).getTime() : 0;
      return timeB - timeA;
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

  // Toggle status sort
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

  // Handle AI analysis
  const handleAIAnalysis = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to use AI analysis");
      return;
    }
    const result = await analyzeWithAI();
    if (result) {
      setShowAIModal(true);
    }
  };

  // Handle add task click
  const handleAddTaskClick = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add tasks");
      return;
    }
    setEditingTask(null);
    form.reset({
      name: "",
      description: "",
      priority: PRIORITY.MEDIUM,
      status: STATUS.TODO,
      estimated_time: 0,
      opened_at: new Date().toLocaleString('sv-SE').slice(0, 16),
      dued_at: new Date().toLocaleString('sv-SE').slice(0, 16),
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h1>
        <div className="space-x-4 flex items-center">
          <Button
            variant="primary"
            onClick={handleAddTaskClick}
          >
            Add Task
          </Button>
          <Button
            variant="primary"
            onClick={handleAIAnalysis}
            isLoading={isAnalyzing}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Analyse with AI
          </Button>
        </div>
      </div>

      {/* Task filters */}
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

      {/* Task list */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        {(isLoading && tasks.length === 0) ? (
          <div className="flex justify-center items-center py-10">
            <LoadingIndicator />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Welcome to Task Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              Log in to create and manage your tasks, track your progress, and get AI-powered insights.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Log In to Get Started
            </Button>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        )}
      </div>

      {/* Task modal */}
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

      {/* Task view modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingTask(null);
        }}
        title="Task Details"
        hideFooter
      >
        {viewingTask && (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Task Name</h3>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{viewingTask.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{viewingTask.description || "No description"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</h3>
                  <div className="mt-1">
                    <PriorityTag priority={viewingTask.priority} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <div className="mt-1">
                    <StatusTag status={viewingTask.status} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Time</h3>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{viewingTask.estimated_time} minutes</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{formatDate(viewingTask.opened_at || "")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{formatDate(viewingTask.dued_at || "")}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  deleteTask(viewingTask.id);
                  setShowViewModal(false);
                }}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleEdit(viewingTask);
                  setShowViewModal(false);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI analysis modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Analysis"
        hideFooter
        containerClassName="!max-w-6xl"
      >
        <div className="bg-gray-50 dark:bg-gray-900 w-full px-6 py-4 rounded-lg shadow-inner">
          {isAnalyzing ? (
            <div className="flex justify-center items-center py-10">
              <LoadingIndicator />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{analysisResult}</Markdown>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={() => setShowAIModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}