/**
 * Supported workflow states for a task.
 */
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

/**
 * Supported urgency levels for a task.
 */
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Supported application roles for authenticated users.
 */
export type Role = 'ADMIN' | 'USER';

/**
 * Normalized task shape used by UI components and Redux state.
 */
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

/**
 * Minimal authenticated user profile stored client-side.
 */
export interface User {
  username: string;
  role: Role;
}

/**
 * Toast notification payload used by the UI message component.
 */
export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
