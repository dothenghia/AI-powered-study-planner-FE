import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { focusService } from "../services/focus";
import { AxiosError } from "axios";

interface UseSaveFocusedTimeReturn {
  saveFocusedTime: (timeInSeconds: number) => Promise<boolean>;
  isSaving: boolean;
  error: string | null;
}

const useSaveFocusedTime = (taskId: string): UseSaveFocusedTimeReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveFocusedTime = useCallback(async (timeInSeconds: number): Promise<boolean> => {
    if (!taskId) {
      setError("Task ID is required");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      // toast.info("Saving focused time...");
      await focusService.saveFocusedTime(taskId, timeInSeconds);
      // toast.dismiss();
      // toast.success("Focus time saved successfully");
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else { 
        toast.error("Failed to save focused time");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [taskId]);

  return { saveFocusedTime, isSaving, error };
};

export default useSaveFocusedTime;