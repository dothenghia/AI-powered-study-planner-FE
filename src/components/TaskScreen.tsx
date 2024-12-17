import { useState, useEffect } from "react";
import { fetchTasks, deleteTask, createTask, updateTask } from "../services/task";
import useAuthStore from "../stores/authStore";
import { ITask } from "../types/task";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TaskScreen = () => {
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
      const { status, ...taskWithoutStatus } = newTask;
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
      const { id, createdBy, created_at, updated_at, ...formattedTask } = editTask;
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
    const sortedTasks = [...filteredTasks].sort((a, b) =>
      sortPriorityAsc
        ? b.priority.localeCompare(a.priority)
        : a.priority.localeCompare(b.priority)
    );
    setFilteredTasks(sortedTasks);
  };

  const toggleSortStatus = () => {
    setSortStatusAsc(!sortStatusAsc);
    const sortedTasks = [...filteredTasks].sort((a, b) =>
      sortStatusAsc
        ? b.status.localeCompare(a.status)
        : a.status.localeCompare(b.status)
    );
    setFilteredTasks(sortedTasks);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterPriority, filterStatus]);

  return (
    <div className="h-screen overflow-y-auto bg-gray-200 p-6">
      <ToastContainer />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>

        {/* Add Task Form */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="p-2 border rounded mb-4 w-full"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="p-2 border rounded mb-4 w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as ITask["priority"] })}
                  className="p-2 border rounded mb-2 w-full"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as ITask["status"] })}
                  className="p-2 border rounded mb-2 w-full"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Expired">Expired</option>
                </select>
                <input
                  type="datetime-local"
                  placeholder="Opened At"
                  value={newTask.opened_at}
                  onChange={(e) => setNewTask({ ...newTask, opened_at: e.target.value })}
                  className="p-2 border rounded mb-2 w-full"
                />
                <input
                  type="datetime-local"
                  placeholder="Due At"
                  value={newTask.dued_at}
                  onChange={(e) => setNewTask({ ...newTask, dued_at: e.target.value })}
                  className="p-2 border rounded mb-2 w-full"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
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
              <input
                type="text"
                placeholder="Task Name"
                value={editTask.name}
                onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                className="p-2 border rounded mb-4 w-full"
              />
              <textarea
                placeholder="Description"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                className="p-2 border rounded mb-4 w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={editTask.priority}
                  onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as ITask["priority"] })}
                  className="p-2 border rounded mb-2 w-full"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={editTask.status}
                  onChange={(e) => setEditTask({ ...editTask, status: e.target.value as ITask["status"] })}
                  className="p-2 border rounded mb-2 w-full"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Expired">Expired</option>
                </select>
                <input
                  type="datetime-local"
                  value={editTask.opened_at}
                  onChange={(e) => setEditTask({ ...editTask, opened_at: e.target.value })}
                  className="p-2 border rounded mb-2 w-full"
                />
                <input
                  type="datetime-local"
                  value={editTask.dued_at}
                  onChange={(e) => setEditTask({ ...editTask, dued_at: e.target.value })}
                  className="p-2 border rounded mb-2 w-full"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={handleUpdateTask} className="bg-blue-500 text-white px-4 py-2 rounded">
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
          <select onChange={(e) => setFilterPriority(e.target.value)} className="p-2 border rounded w-40">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded w-40">
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
          <button onClick={toggleSortPriority} className="bg-green-500 text-white px-4 py-2 rounded">
            Sort by Priority {sortPriorityAsc ? "↑" : "↓"}
          </button>
          <button onClick={toggleSortStatus} className="bg-orange-500 text-white px-4 py-2 rounded">
            Sort by Status {sortStatusAsc ? "↑" : "↓"}
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li key={task.id} className="p-4 bg-white rounded shadow flex justify-between items-end">
              <div>
                <h2 className="font-semibold text-xl">{task.name}</h2>
                <p className="text-gray-500">{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>Opened At: {new Date(task.opened_at || "").toLocaleString()}</p>
                <p>Due At: {new Date(task.dued_at || "").toLocaleString()}</p>
              </div>
              <div>
                <button onClick={() => handleEditClick(task)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Update
                </button>
                <button onClick={() => handleDelete(task.id)} className="ml-4 bg-red-500 text-white px-3 py-1 rounded">
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
