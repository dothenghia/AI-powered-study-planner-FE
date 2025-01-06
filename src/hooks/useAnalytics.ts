import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { analyticsService } from '../services/analytics';
import { useAuthStore } from '../stores';

interface AnalyticsConfig {
  showToast?: boolean;
}

export const useAnalytics = (config: AnalyticsConfig = { showToast: true }) => {
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingFocusTime, setIsLoadingFocusTime] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [taskStatusData, setTaskStatusData] = useState<any>(null);
  const [focusedTimeData, setFocusedTimeData] = useState<any>(null);
  const [focusedTimeSummary, setFocusedTimeSummary] = useState<any>(null);
  const { userId } = useAuthStore();

  const fetchTaskStatusData = useCallback(async () => {
    if (!userId) return;

    setIsLoadingStatus(true);
    try {
      const statusCount = await analyticsService.getTaskStatusCount(userId);
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
    } catch (error) {
      console.error('Error fetching task status:', error);
      if (config.showToast) {
        toast.error('Failed to load task status data');
      }
    } finally {
      setIsLoadingStatus(false);
    }
  }, [userId, config.showToast]);

  const fetchFocusTimeData = useCallback(async () => {
    if (!userId) return;

    setIsLoadingFocusTime(true);
    try {
      const timeByDate = await analyticsService.getFocusedTimeByDate(userId);
      setFocusedTimeData({
        labels: timeByDate.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Focus Time (minutes)',
          data: timeByDate.map(item => item.totalSeconds),
          borderColor: '#1677ff',
          backgroundColor: '#1677ff',
          tension: 0.4,
        }],
      });
    } catch (error) {
      console.error('Error fetching focus time:', error);
      if (config.showToast) {
        toast.error('Failed to load focus time data');
      }
    } finally {
      setIsLoadingFocusTime(false);
    }
  }, [userId, config.showToast]);

  const fetchFocusTimeSummary = useCallback(async () => {
    if (!userId) return;

    setIsLoadingSummary(true);
    try {
      const timeSummary = await analyticsService.getFocusedTimeSummary(userId);
      setFocusedTimeSummary({
        labels: ['Focused Time', 'Estimated Time'],
        datasets: [{
          data: [
            timeSummary.total_focused_time_in_7_days,
            timeSummary.total_estimated_time_in_7_days,
          ],
          backgroundColor: ['#1677ff', '#90c6fe'],
          borderWidth: 1,
        }],
      });
    } catch (error) {
      console.error('Error fetching focus summary:', error);
      if (config.showToast) {
        toast.error('Failed to load focus summary data');
      }
    } finally {
      setIsLoadingSummary(false);
    }
  }, [userId, config.showToast]);

  return {
    isLoadingStatus,
    isLoadingFocusTime,
    isLoadingSummary,
    taskStatusData,
    focusedTimeData,
    focusedTimeSummary,
    fetchTaskStatusData,
    fetchFocusTimeData,
    fetchFocusTimeSummary,
  };
}; 