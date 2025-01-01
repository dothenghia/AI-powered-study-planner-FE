import { useState } from "react";

const useSaveFocusedTime = (taskId: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveFocusedTime = async (timeInSeconds: number) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/tasks/${taskId}/focused-time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeInSeconds }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save focused time: ${response.statusText}`);
      }

      console.log("Focused time saved successfully!");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error saving focused time:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveFocusedTime, isSaving, error };
};

export default useSaveFocusedTime;