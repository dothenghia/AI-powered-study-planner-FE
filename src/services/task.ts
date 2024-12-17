import apiInstance from "./config";
import { ITask } from "../types/task";

export const fetchTasks = async (userId: string) => {
  try {
    const response = await apiInstance.get(`/tasks?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    await apiInstance.delete(`/tasks/${id}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const createTask = async (taskData: Partial<ITask>) => {
  try {
    const response = await apiInstance.post("/tasks", taskData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id: string, taskData: Partial<ITask>) => {
  try {
    const response = await apiInstance.put(`/tasks/${id}`, taskData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
