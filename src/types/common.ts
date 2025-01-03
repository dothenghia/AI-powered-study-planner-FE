export type Status = "Todo" | "In Progress" | "Completed" | "Expired";
export type Priority = "High" | "Medium" | "Low";

export const STATUS = {
  TODO: "Todo" as Status,
  IN_PROGRESS: "In Progress" as Status,
  COMPLETED: "Completed" as Status,
  EXPIRED: "Expired" as Status,
}

export const PRIORITY = {
  HIGH: "High" as Priority,
  MEDIUM: "Medium" as Priority,
  LOW: "Low" as Priority,
}

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