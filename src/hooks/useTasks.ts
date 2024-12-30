import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../services/task';
import { ITask } from '../types/task';
import { useAuthStore } from '../stores';

export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuthStore();

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      toast.info('Loading tasks...');
      const data = await taskService.fetchTasks(userId);
      setTasks(data);
      toast.dismiss();
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createTask = async (taskData: Partial<ITask>) => {
    if (!userId) return;
    
    try {
      toast.info('Adding task...');
      await taskService.createTask({ ...taskData, userId });
      await fetchTasks();
      toast.success('Task added successfully.');
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
      return false;
    }
  };

  const updateTask = async (id: string, taskData: Partial<ITask>) => {
    try {
      toast.info('Updating task...');
      await taskService.updateTask(id, taskData);
      await fetchTasks();
      toast.success('Task updated successfully.');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      toast.info('Deleting task...');
      await taskService.deleteTask(id);
      await fetchTasks();
      toast.success('Task deleted successfully.');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
      return false;
    }
  };

  return {
    tasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}; 