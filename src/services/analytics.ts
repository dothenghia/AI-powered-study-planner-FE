import { api } from './api';

interface TaskStatusCount {
  Todo: number;
  'In Progress': number;
  Completed: number;
  Expired: number;
}

interface FocusedTimeByDate {
  date: string;
  totalSeconds: number;
}

interface FocusedTimeSummary {
  total_focused_time_in_7_days: number;
  total_estimated_time_in_7_days: number;
}

// Mock data for development
const mockTaskStatusCount: TaskStatusCount = {
  'Todo': 5,
  'In Progress': 3,
  'Completed': 8,
  'Expired': 2
};

// Generate last 7 days for mock data
const generatePastDays = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const mockFocusedTimeByDate: FocusedTimeByDate[] = generatePastDays(7).map(date => ({
  date,
  totalSeconds: Math.floor(Math.random() * 7200) // Random seconds between 0 and 2 hours
}));

const mockFocusedTimeSummary: FocusedTimeSummary = {
  total_focused_time_in_7_days: 18000, // 5 hours in seconds
  total_estimated_time_in_7_days: 25200  // 7 hours in seconds
};

export const analyticsService = {
  getTaskStatusCount: async (userId: string): Promise<TaskStatusCount> => {
    // Uncomment when API is ready
    // const response = await api.get(`/tasks/status-count/${userId}`);
    // return response.data.data;
    
    // Return mock data
    return new Promise(resolve => setTimeout(() => resolve(mockTaskStatusCount), 800));
  },

  getFocusedTimeByDate: async (userId: string): Promise<FocusedTimeByDate[]> => {
    // Uncomment when API is ready
    // const response = await api.get(`/tasks/focused-time-count/${userId}`);
    // return response.data.data;
    
    // Return mock data
    return new Promise(resolve => setTimeout(() => resolve(mockFocusedTimeByDate), 1000));
  },

  getFocusedTimeSummary: async (userId: string): Promise<FocusedTimeSummary> => {
    // Uncomment when API is ready
    // const response = await api.get(`/tasks/focused-time-count-7-days/${userId}`);
    // return response.data.data;
    
    // Return mock data
    return new Promise(resolve => setTimeout(() => resolve(mockFocusedTimeSummary), 500));
  }
};
