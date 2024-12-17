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
    opened_at: "",
    dued_at: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (userId && accessToken) {
      loadTasks();
    }
  }, [userId, accessToken]);

  const loadTasks = async () => {
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
    try {
      await createTask({ ...newTask, userId });
      setNewTask({ name: "", description: "", priority: "Medium", opened_at: "", dued_at: "" });
      loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  return (
    <div className="h-screen bg-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      {/* Add Task Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as ITask["priority"] })}
            className="p-2 border rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="datetime-local"
            placeholder="Opened At"
            value={newTask.opened_at}
            onChange={(e) => setNewTask({ ...newTask, opened_at: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="Due At"
            value={newTask.dued_at}
            onChange={(e) => setNewTask({ ...newTask, dued_at: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddTask}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />

      {/* Task List */}
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{task.name}</h2>
              <p className="text-sm text-gray-500">{task.description}</p>
              <p className="text-sm">
                <span className="font-medium">Priority:</span> {task.priority}
              </p>
              <p className="text-sm">
                <span className="font-medium">Opened At:</span> {task.opened_at}
              </p>
              <p className="text-sm">
                <span className="font-medium">Due At:</span> {task.dued_at}
              </p>
            </div>
            <div className="space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
