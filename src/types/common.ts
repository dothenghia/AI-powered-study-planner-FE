export type Status = "Todo" | "In Progress" | "Completed" | "Expired";
export type Priority = "High" | "Medium" | "Low";

export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
  total: number;
  page: number;
  limit: number;
} 