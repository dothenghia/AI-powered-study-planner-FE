import apiInstance from "./config";

export const prompt = async (userId: string) => {
  try {
    const response = await apiInstance.post("/prompt", {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};