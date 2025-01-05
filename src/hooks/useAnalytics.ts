import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { analyticsService } from '../services/analytics';
import { useAuthStore } from '../stores';

interface AnalyticsConfig {
  showToast?: boolean;
}

export const useAnalytics = (config: AnalyticsConfig = { showToast: true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskStatusData, setTaskStatusData] = useState<any>(null);
  const [focusedTimeData, setFocusedTimeData] = useState<any>(null);
  const [focusedTimeSummary, setFocusedTimeSummary] = useState<any>(null);
  const { userId } = useAuthStore();

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [statusCount, timeByDate, timeSummary] = await Promise.all([
        analyticsService.getTaskStatusCount(userId),
        analyticsService.getFocusedTimeByDate(userId),
        analyticsService.getFocusedTimeSummary(userId)
      ]);

      // Prepare task status data
      setTaskStatusData({
        labels: Object.keys(statusCount),
        datasets: [{
          data: Object.values(statusCount),
          backgroundColor: [
            '#eab308', // Todo
            '#1677ff', // In Progress
            '#22c55e', // Completed
            '#6b7280', // Expired
          ],
          borderWidth: 1,
        }],
      });

      // Prepare focused time by date data
      setFocusedTimeData({
        labels: timeByDate.map(item => item.date),
        datasets: [{
          label: 'Focus Time (minutes)',
          data: timeByDate.map(item => Math.round(item.totalSeconds / 60)),
          borderColor: '#1677ff',
          tension: 0.4,
        }],
      });

      // Prepare focused time summary data
      setFocusedTimeSummary({
        labels: ['Focused Time', 'Estimated Time'],
        datasets: [{
          data: [
            Math.round(timeSummary.total_focused_time_in_7_days / 60),
            Math.round(timeSummary.total_estimated_time_in_7_days / 60),
          ],
          backgroundColor: ['#1677ff', '#90c6fe'],
          borderWidth: 1,
        }],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (config.showToast) {
        toast.error('Failed to load analytics data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, config.showToast]);

  return {
    isLoading,
    taskStatusData,
    focusedTimeData,
    focusedTimeSummary,
    fetchAnalytics,
  };
}; 