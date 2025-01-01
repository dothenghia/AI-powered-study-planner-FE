import { api } from './api';
import { ITask } from '../types/task';

export const taskService = {
  fetchTasks: async (userId: string): Promise<ITask[]> => {
    const response = await api.get('/tasks', {
      params: { userId }
    });
    return response.data.data;
  },

  createTask: async (taskData: Partial<ITask>): Promise<ITask> => {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  },

  updateTask: async (id: string, taskData: Partial<ITask>): Promise<ITask> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};
