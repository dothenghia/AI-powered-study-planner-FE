import { useEffect } from 'react';
import { useAuthStore } from '../../stores';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingIndicator from 'react-loading-indicator';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/constants';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function Analytics() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const {
    isLoadingStatus,
    isLoadingFocusTime,
    isLoadingSummary,
    taskStatusData,
    focusedTimeData,
    focusedTimeSummary,
    fetchTaskStatusData,
    fetchFocusTimeData,
    fetchFocusTimeSummary,
  } = useAnalytics();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch all data independently
      fetchTaskStatusData();
      fetchFocusTimeData();
      fetchFocusTimeSummary();
    }
  }, [isAuthenticated, fetchTaskStatusData, fetchFocusTimeData, fetchFocusTimeSummary]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to Analytics Dashboard
        </h2>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Log in to view detailed analytics about your tasks, focus time, and productivity trends.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          Log In to Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Task Status Distribution</h2>
          <div className="h-[300px] flex items-center justify-center">
            {isLoadingStatus ? (
              <LoadingIndicator />
            ) : taskStatusData && (
              <Doughnut
                data={taskStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Focus Time vs Estimated Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">7-Day Focus vs Estimated Time (minutes)</h2>
          <div className="h-[300px] flex items-center justify-center">
            {isLoadingSummary ? (
              <LoadingIndicator />
            ) : focusedTimeSummary && (
              <Doughnut
                data={focusedTimeSummary}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Focus Time Trend */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Daily Focus Time Trend (minutes)</h2>
          <div className="h-[300px]">
            {isLoadingFocusTime ? (
              <div className="flex items-center justify-center h-full">
                <LoadingIndicator />
              </div>
            ) : focusedTimeData && (
              <Line
                data={focusedTimeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
