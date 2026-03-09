import { Task, User } from './types';

const USER_KEY = 'ticketing_user';
const TASKS_KEY = 'ticketing_tasks';

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
