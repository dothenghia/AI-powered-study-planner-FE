import { api } from "./api";

export const focusService = {
  saveFocusedTime: async (taskId: string, timeInSeconds: number) => {
    const response = await api.post(`/tasks/${taskId}/focused-time`, {
      timeInSeconds,
    });
    return response.data;
  },
};
