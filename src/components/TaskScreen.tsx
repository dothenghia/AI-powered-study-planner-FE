import { useState, useEffect } from "react";
import { fetchTasks, deleteTask, createTask } from "../services/task";
import useAuthStore from "../stores/authStore";
import { ITask } from "../types/task";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortType, setSortType] = useState<"priority" | "status" | "">("");

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
      const data = await fetchTasks(userId);
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async () => {
    if (userId == null) {
      return;
    }
    try {
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
    } catch (error) {
      console.error("Error adding task:", error);
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

    if (sortType) {
      filtered.sort((a, b) => a[sortType].localeCompare(b[sortType]));
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterPriority, filterStatus, sortType]);

  return (
    <div className="h-screen overflow-y-auto bg-gray-200 p-6">
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

        {/* Filter & Sort */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
          <select onChange={(e) => setFilterPriority(e.target.value)} className="p-2 border rounded">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
          <select onChange={(e) => setSortType(e.target.value as "priority" | "status" | "")} className="p-2 border rounded">
            <option value="">No Sort</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li key={task.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <h2 className="font-semibold">{task.name}</h2>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Opened At: {new Date(task.opened_at || "").toLocaleString()}</p>
                <p>Due At: {new Date(task.dued_at || "").toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
