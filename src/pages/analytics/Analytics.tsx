import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingIndicator from 'react-loading-indicator';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/constants';
import { promptService } from '../../services/prompt';
import { toast } from 'react-toastify';
import Markdown from 'react-markdown';
import { Modal } from '../../components/ui/Modal';

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
  const { isAuthenticated, userId } = useAuthStore();
  const navigate = useNavigate();
  const {
    isLoadingStatus,
    isLoadingFocusTime,
    isLoadingSummary,
    taskStatusData,
    taskStatusDataRaw,
    focusedTimeData,
    focusedTimeDataRaw,
    focusedTimeSummary,
    focusedTimeSummaryRaw,
    fetchTaskStatusData,
    fetchFocusTimeData,
    fetchFocusTimeSummary,
  } = useAnalytics();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // Fetch all data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch all data independently
      fetchTaskStatusData();
      fetchFocusTimeData();
      fetchFocusTimeSummary();
    }
  }, [isAuthenticated, fetchTaskStatusData, fetchFocusTimeData, fetchFocusTimeSummary]);

  // Handle AI analysis
  const handleAIAnalysis = async () => {
    if (!isAuthenticated || !userId) {
      toast.info("Please log in to use AI analysis");
      return;
    }

    if (!taskStatusDataRaw || !focusedTimeDataRaw || !focusedTimeSummaryRaw) {
      toast.info("Please wait for all data to load before analyzing");
      return;
    }

    setIsAnalyzing(true);
    setShowAIModal(true);

    try {
      const response = await promptService.analyzeAnalyticsWithAI(userId, {
        taskStatusData: taskStatusDataRaw || {
          Todo: 0,
          'In Progress': 0,
          Completed: 0,
          Expired: 0,
        },
        focusedTimeData: focusedTimeDataRaw || [],
        focusedTimeSummary: focusedTimeSummaryRaw || {
          total_focused_time_in_7_days: 0,
          total_estimated_time_in_7_days: 0,
        },
      });
      setAnalysisResult(response.message);
    } catch (error) {
      console.error('Error analyzing with AI:', error);
      toast.error('Failed to analyze with AI');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render loading indicator if user is not authenticated
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Button
          variant="primary"
          onClick={handleAIAnalysis}
          isLoading={isAnalyzing}
        >
          ✨ Analyze with AI
        </Button>
      </div>
      
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

      {/* AI Analysis Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Analysis"
        hideFooter
        containerClassName="!max-w-6xl"
      >
        <div className="bg-gray-50 w-full px-6 py-4 rounded-lg shadow-inner">
          {isAnalyzing ? (
            <div className="flex justify-center items-center py-10">
              <LoadingIndicator />
            </div>
          ) : (
            <div className="prose max-w-none">
              <Markdown>{analysisResult}</Markdown>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={() => setShowAIModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
