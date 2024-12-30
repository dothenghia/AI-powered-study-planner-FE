import { useState } from 'react';
import { toast } from 'react-toastify';
import { promptService } from '../services/prompt';
import { useAuthStore } from '../stores';

export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const { userId } = useAuthStore();

  const analyzeWithAI = async () => {
    if (!userId) return;

    setIsAnalyzing(true);
    try {
      const response = await promptService.analyzeWithAI(userId);
      setAnalysisResult(response.message);
      return response.message;
    } catch (error) {
      toast.error('Failed to analyze with AI.');
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analysisResult,
    analyzeWithAI,
  };
}; 