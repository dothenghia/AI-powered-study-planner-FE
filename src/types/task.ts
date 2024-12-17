
export interface ITask {
  id: string;
  userId?: string;
  createdBy?: string;
  name: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Completed" | "Expired";
  estimated_time?: number;
  opened_at?: string;
  dued_at?: string;
}
