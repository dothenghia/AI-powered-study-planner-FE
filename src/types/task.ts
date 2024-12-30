import { Priority, Status } from './common';

export interface ITask {
  id: string;
  userId?: string;
  createdBy?: string;
  name: string;
  description?: string;
  priority: Priority;
  status: Status;
  estimated_time?: number;
  opened_at?: string;
  dued_at?: string;
  created_at?: string;
  updated_at?: string;
}
