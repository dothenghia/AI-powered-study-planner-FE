import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../services/task';
import { ITask } from '../types/task';
import { useAuthStore } from '../stores';

export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuthStore();

  // Fetch tasks by user id
  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await taskService.fetchTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Create a new task
  const createTask = async (taskData: Partial<ITask>): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      toast.info('Adding task...');
      await taskService.createTask({ ...taskData, userId });
      await fetchTasks();
      toast.dismiss();
      toast.success('Task added successfully');
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return false;
    }
  };

  // Update an existing task
  const updateTask = async (id: string, taskData: Partial<ITask>): Promise<boolean> => {
    try {
      toast.info('Updating task...');
      
      const updateBody = {
        name: taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        estimated_time: taskData.estimated_time,
        opened_at: taskData.opened_at,
        dued_at: taskData.dued_at
      };

      await taskService.updateTask(id, updateBody);
      await fetchTasks();
      toast.dismiss();
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Delete an existing task
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      toast.info('Deleting task...');
      await taskService.deleteTask(id);
      await fetchTasks();
      toast.dismiss();
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
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