import { useState, useCallback } from 'react';
import AIService from '../services/openaiService';
import type { Symptom, AnalysisResult } from '../services/openaiService';

interface UseAIReturn {
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResult | null;
  healthTips: string[];
  analyzeSymptoms: (symptoms: Symptom[]) => Promise<AnalysisResult | null>;
  generateHealthTips: (analysisResult: AnalysisResult) => Promise<void>;
  clearResults: () => void;
}

export const useAI = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [healthTips, setHealthTips] = useState<string[]>([]);

  const aiService = AIService.getInstance();

  const analyzeSymptoms = useCallback(async (symptoms: Symptom[]) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await aiService.analyzeSymptoms(symptoms);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Symptom analysis error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [aiService]);

  const generateHealthTips = useCallback(async (analysisResult: AnalysisResult) => {
    setIsLoading(true);
    setError(null);

    try {
      const tips = await aiService.generateHealthTips(analysisResult);
      setHealthTips(tips);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate health tips';
      setError(errorMessage);
      console.error('Health tips generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [aiService]);

  const clearResults = useCallback(() => {
    setAnalysisResult(null);
    setHealthTips([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    analysisResult,
    healthTips,
    analyzeSymptoms,
    generateHealthTips,
    clearResults,
  };
};

// Export both names for backward compatibility
export const useOpenAI = useAI;
export default useAI;
