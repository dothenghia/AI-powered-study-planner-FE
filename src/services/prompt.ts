import { api } from './api';
import { PromptResponse } from '../types/prompt';

export const promptService = {
  analyzeWithAI: async (userId: string): Promise<PromptResponse> => {
    const response = await api.post('/prompt', {
      data: { userId }
    });
    return response.data;
  }
};