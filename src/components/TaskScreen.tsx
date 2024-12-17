import { useState, useEffect } from "react";
import {
  fetchTasks,
  deleteTask,
  createTask,
  updateTask,
} from "../services/task";
import { prompt } from "../services/prompt";
import useAuthStore from "../stores/authStore";
import { ITask } from "../types/task";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import Markdown from "react-markdown";
import LoadingIndicator from "react-loading-indicator";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Lưu ý tháng bắt đầu từ 0
  const year = date.getFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const TaskScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [promptResponse, setPromptResponse] = useState("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [newTask, setNewTask] = useState<Partial<ITask>>({
    name: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    opened_at: "",
    dued_at: "",
  });
  const [editTask, setEditTask] = useState<Partial<ITask> | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [sortPriorityAsc, setSortPriorityAsc] = useState(true);
  const [sortStatusAsc, setSortStatusAsc] = useState(true);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (userId && accessToken) {
      loadTasks();
    }
  }, [userId, accessToken]);

  const loadTasks = async () => {
    if (userId == null) {
      return;
    }
    try {
      toast.info("Loading tasks...");
      const data = await fetchTasks(userId);
      setTasks(data);
      setFilteredTasks(data);
      toast.dismiss();
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.info("Deleting task...");
      await deleteTask(id);
      loadTasks();
      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleAddTask = async () => {
    if (userId == null) {
      return;
    }
    try {
      toast.info("Adding task...");

      const { ...taskWithoutStatus } = newTask;
      await createTask({ ...taskWithoutStatus, userId });

      setNewTask({
        name: "",
        description: "",
        priority: "Medium",
        status: "Todo",
        opened_at: "",
        dued_at: "",
      });
      setShowModal(false);
      loadTasks();
      toast.success("Task added successfully.");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };

  const handleEditClick = (task: ITask) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editTask || !editTask.id) return;

    try {
      toast.info("Updating task...");

      // Remove unnecessary fields before updating
      const { id, createdBy, created_at, updated_at, ...formattedTask } =
        editTask;
      await updateTask(editTask.id, formattedTask);


      setShowEditModal(false);
      loadTasks();
      toast.success("Task updated successfully.");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleSearch = () => {
    let filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterPriority) {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    setFilteredTasks(filtered);
  };

  const toggleSortPriority = () => {
    setSortPriorityAsc(!sortPriorityAsc);
    const priorityOrder = sortPriorityAsc
      ? ["Low", "Medium", "High"]
      : ["High", "Medium", "Low"];

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      return (
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );
    });

    setFilteredTasks(sortedTasks);
  };

  const toggleSortStatus = () => {
    setSortStatusAsc(!sortStatusAsc);
    const statusOrder = sortStatusAsc
      ? ["Todo", "In Progress", "Completed", "Expired"]
      : ["Completed", "In Progress", "Todo", "Expired"];

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });

    setFilteredTasks(sortedTasks);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterPriority, filterStatus]);

  const handleAIAnalyse = async () => {
    if (userId) {
      try {
        setShowAIResponse(true);
        setIsLoading(true);
        const response = await prompt(userId);
        setPromptResponse(response.message);
        setIsLoading(false);
      } catch (_) {
        setIsLoading(false);
        setShowAIResponse(false);
        toast.error("Failed to prompt with AI.");
      }
    }
  };

  const closeAIResponsePopup = () => {
    setShowAIResponse(false);
    setPromptResponse("");
  };

  return (
    <div className="min-h-full bg-gray-200 p-6">
      <ToastContainer />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>
        <div className="flex-1 justify-between">
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
          <button
            onClick={handleAIAnalyse}
            className="ms-4 mb-4 bg-purple-500 text-white px-4 py-2 rounded"
          >
            ★ Analyse with AI
          </button>
        </div>

        {showAIResponse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            {isLoading ? (
              <div className="bg-white p-10 rounded shadow justify-center items-center">
                <LoadingIndicator />
              </div>
            ) : (
              <div className="bg-gradient-to-b from-white to-gray-100 p-10 w-1/2 h-2/3 rounded-lg shadow-lg flex flex-col items-center overflow-y-scroll">
                <p className="text-2xl text-center font-bold mb-6 text-gray-800">
                  AI Analysis
                </p>
                <div className="bg-gray-50 w-full px-6 py-4 rounded-lg shadow-inner">
                  <Markdown className="text-gray-700">
                    {promptResponse}
                  </Markdown>
                </div>
                <div className="flex justify-center mt-6 w-full">
                  <button
                    onClick={closeAIResponsePopup}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Task Form */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

              <label className="block mb-2">Task Name</label>
              <input
                type="text"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className="p-2 border rounded mb-4 w-full"
              />

              <label className="block mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="p-2 border rounded mb-4 w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as ITask["priority"],
                    })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as ITask["status"],
                    })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Opened At</label>
                  <input
                    type="datetime-local"
                    value={newTask.opened_at}
                    onChange={(e) =>
                    setNewTask({ ...newTask, opened_at: e.target.value })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2">Due At</label>
                  <input
                    type="datetime-local"
                    value={newTask.dued_at}
                    onChange={(e) =>
                    setNewTask({ ...newTask, dued_at: e.target.value })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add New Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Form */}
        {showEditModal && editTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Update Task</h2>

              <label className="block mb-2">Task Name</label>
              <input
                type="text"
                value={editTask.name}
                onChange={(e) =>
                  setEditTask({ ...editTask, name: e.target.value })
                }
                className="p-2 border rounded mb-4 w-full"
              />

              <label className="block mb-2">Description</label>
              <textarea
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                className="p-2 border rounded mb-4 w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Priority</label>
                  <select
                    value={editTask.priority}
                    onChange={(e) =>
                    setEditTask({
                      ...editTask,
                      priority: e.target.value as ITask["priority"],
                    })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={editTask.status}
                    onChange={(e) =>
                    setEditTask({
                      ...editTask,
                      status: e.target.value as ITask["status"],
                    })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Opened At</label>
                  <input
                    type="datetime-local"
                    value={editTask.opened_at ? new Date(editTask.opened_at).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                    setEditTask({ ...editTask, opened_at: e.target.value })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2">Due At</label>
                  <input
                    type="datetime-local"
                    value={editTask.dued_at ? new Date(editTask.dued_at).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                    setEditTask({ ...editTask, dued_at: e.target.value })
                  }
                    className="p-2 border rounded mb-2 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Sort */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border rounded w-40"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded w-40"
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
          <button
            onClick={toggleSortPriority}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sort by Priority {sortPriorityAsc ? "↑" : "↓"}
          </button>
          <button
            onClick={toggleSortStatus}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Sort by Status {sortStatusAsc ? "↑" : "↓"}
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded shadow flex justify-between items-end"
            >
              <div>
                <h2 className="font-semibold text-xl">{task.name}</h2>
                <p className="text-gray-500">{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>
                  Opened At: {formatDate(task.opened_at || "")}
                </p>
                <p>Due At: {formatDate(task.dued_at || "")}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
