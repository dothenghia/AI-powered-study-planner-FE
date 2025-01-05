export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  // Input format: "2025-01-05T19:01:00.000Z"
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [time] = timePart.split(".");
  const [hours, minutes] = time.split(":");

  return `${day}/${month}/${year} - ${hours}:${minutes}`; // Output example: "05/01/2025 - 19:01"
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const formatDateForComparison = (dateString: string) => {
  // Input format: "2025-01-05T19:01:00.000Z"
  // Output format: "2025-01-05 19:01:00"
  const [datePart, timePart] = dateString.split("T");
  const [hours, minutes] = timePart.split(":");
  return `${datePart} ${hours}:${minutes}:00`;
}

export const compareDates = (date1: string, date2: string): number => {
  // Convert strings to Date objects
  const d1 = new Date(date1.replace(' ', 'T'));
  const d2 = new Date(date2.replace(' ', 'T'));
  
  // Return:
  // -1 if date1 is before date2
  //  0 if dates are equal
  //  1 if date1 is after date2
  return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
}