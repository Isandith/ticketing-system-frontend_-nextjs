import { Task, User } from './types';

const USER_KEY = 'ticketing_user';
const TASKS_KEY = 'ticketing_tasks';
const ACCESS_TOKEN_KEY = 'ticketing_access_token';

export const storage = {
  getUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as User) : null;
  },

  setUser(user: User) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getAccessToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  },

  setAccessToken(token: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getTasks(): Task[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const value = window.localStorage.getItem(TASKS_KEY);
    return value ? (JSON.parse(value) as Task[]) : [];
  },

  setTasks(tasks: Task[]) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
};
