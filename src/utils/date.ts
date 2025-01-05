export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  
  // Input format: "2025-01-05T19:01:00.000Z"
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [time] = timePart.split(".");
  const [hours, minutes] = time.split(":");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
