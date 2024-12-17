import { useState, useEffect } from "react";
import { fetchTasks, updateTask } from "../services/task";
import useAuthStore from "../stores/authStore";
import { ITask } from "../types/task";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CalendarScreen = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
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
      toast.dismiss();
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks.");
    }
  };

  return (
    <div className="min-h-full bg-gray-200 p-6">
      <ToastContainer />

      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Scheduling (Calendar View)</h1>


      </div>
    </div>
  );
};
