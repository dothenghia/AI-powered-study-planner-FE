import { api } from './api';
import { PromptResponse } from '../types/prompt';
import { TaskStatusCount, FocusedTimeSummary, FocusedTimeByDate } from './analytics';

export const promptService = {
  analyzeWithAI: async (userId: string): Promise<PromptResponse> => {
    const response = await api.post('/prompt', {
      data: { userId }
    });
    return response.data;
  },

  analyzeAnalyticsWithAI: async (userId: string, analyticsData: {
    taskStatusData: TaskStatusCount;
    focusedTimeData: FocusedTimeByDate[];
    focusedTimeSummary: FocusedTimeSummary;
  }): Promise<PromptResponse> => {
    const prompt = `Please analyze this user's work progress, efficiency, and productivity over the past 7 days based on the following data:

1. Task Status Distribution:
${Object.entries(analyticsData.taskStatusData).map(([status, count]) => `- ${status}: ${count} tasks`).join('\n')}

2. Daily Focus Time (in minutes):
${analyticsData.focusedTimeData.map((item: any) => `- ${item.date}: ${item.totalSeconds} minutes`).join('\n')}

3. 7-Day Focus Summary:
- Total Focused Time: ${analyticsData.focusedTimeSummary.total_focused_time_in_7_days} minutes
- Total Estimated Time: ${analyticsData.focusedTimeSummary.total_estimated_time_in_7_days} minutes

Please provide:
1. An overall assessment of work efficiency and productivity
2. Analysis of task management and completion rate
3. Analysis of time management and focus sessions
4. Recommendations for improvement
5. Notable achievements or areas of concern`;

    const response = await api.post('/prompt/by-string', {
      userId,
      prompt
    });
    return response.data;
  }
};
