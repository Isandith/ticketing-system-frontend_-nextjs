export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Role = 'ADMIN' | 'USER';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
}

export interface User {
  username: string;
  role: Role;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
