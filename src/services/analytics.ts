import { api } from './api';

export interface TaskStatusCount {
  'Todo': number;
  'In Progress': number;
  'Completed': number;
  'Expired': number;
}

export interface FocusedTimeByDate {
  date: string;
  totalSeconds: number;
}

export interface FocusedTimeSummary {
  total_focused_time_in_7_days: number;
  total_estimated_time_in_7_days: number;
}

// Helper function to get the last 7 days including today
const getLast7Days = (): string[] => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Helper function to fill missing dates with zero values
const fillMissingDates = (data: FocusedTimeByDate[]): FocusedTimeByDate[] => {
  const last7Days = getLast7Days();
  const dataMap = new Map(data.map(item => [item.date, item.totalSeconds]));

  return last7Days.map(date => ({
    date,
    totalSeconds: secondsToMinutes(dataMap.get(date) || 0)
  }));
};

// Helper function to convert seconds to minutes
const secondsToMinutes = (seconds: number): number => {
  return parseFloat((seconds / 60).toFixed(2));
};

export const analyticsService = {
  getTaskStatusCount: async (userId: string): Promise<TaskStatusCount> => {
    const response = await api.get(`/tasks/status-count/${userId}`);
    return response.data.data;
  },

  getFocusedTimeByDate: async (userId: string): Promise<FocusedTimeByDate[]> => {
    const response = await api.get(`/tasks/focused-time-count/${userId}`);
    // Fill missing dates with zero values
    return fillMissingDates(response.data.data);
  },

  getFocusedTimeSummary: async (userId: string): Promise<FocusedTimeSummary> => {
    const response = await api.get(`/tasks/focused-time-count-7-days/${userId}`);
    const data = response.data.data;
    // Convert seconds to minutes in the response
    return {
      total_focused_time_in_7_days: secondsToMinutes(data.total_focused_time_in_7_days),
      total_estimated_time_in_7_days: data.total_estimated_time_in_7_days
    };
  }
};
