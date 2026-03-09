import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Priority, Status, Task } from '@/lib/types';
import { TaskRequest, TaskResponse } from '@/lib/Interfaces/task_Interface';
import { UserResponse } from '@/lib/Interfaces/user_Interface';
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  getTasks as getTasksApi,
  markTaskCompleted as markTaskCompletedApi,
  updateTask as updateTaskApi,
} from '@/lib/Services/task_Services';
import { getAllUsers as getAllUsersApi } from '@/lib/Services/user_Services';

interface TaskState {
  tasks: Task[];
  users: UserResponse[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  statusFilter: Status | 'ALL';
  priorityFilter: Priority | 'ALL';
  userFilter: number | 'ALL';
  sortBy: 'DUE_DATE' | 'PRIORITY';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
}

const initialState: TaskState = {
  tasks: [],
  users: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalElements: 0,
  statusFilter: 'ALL',
  priorityFilter: 'ALL',
  userFilter: 'ALL',
  sortBy: 'DUE_DATE',
  sortDirection: 'asc',
  searchQuery: '',
};

const mapTaskResponse = (taskResponse: TaskResponse): Task => ({
  id: taskResponse.id,
  title: taskResponse.title,
  description: taskResponse.description,
  status: taskResponse.status as Status,
  priority: taskResponse.priority as Priority,
  dueDate: taskResponse.dueDate,
  createdAt: taskResponse.createdAt,
  updatedAt: taskResponse.updatedAt,
  userId: taskResponse.userId,
});

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TaskState };
      const {
        currentPage,
        pageSize,
        statusFilter,
        priorityFilter,
        userFilter,
        sortBy,
        sortDirection,
      } = state.tasks;

      const response = await getTasksApi({
        page: currentPage - 1,
        size: pageSize,
        sortBy: sortBy === 'DUE_DATE' ? 'dueDate' : 'priority',
        sortDirection,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        userId: userFilter !== 'ALL' ? userFilter : undefined,
      });

      return {
        tasks: response.content.map(mapTaskResponse),
        totalPages: Math.max(response.totalPages || 1, 1),
        totalElements: response.totalElements || 0,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load tasks');
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskRequest, { rejectWithValue }) => {
    try {
      await createTaskApi(taskData);
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }: { taskId: number; taskData: TaskRequest }, { rejectWithValue }) => {
    try {
      await updateTaskApi(taskId, taskData);
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  },
);

export const markTaskCompleted = createAsyncThunk(
  'tasks/markTaskCompleted',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await markTaskCompletedApi(taskId);
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark task completed');
    }
  },
);

export const fetchUsers = createAsyncThunk('tasks/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const users = await getAllUsersApi();
    return users;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to load users');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<Status | 'ALL'>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setPriorityFilter: (state, action: PayloadAction<Priority | 'ALL'>) => {
      state.priorityFilter = action.payload;
      state.currentPage = 1;
    },
    setUserFilter: (state, action: PayloadAction<number | 'ALL'>) => {
      state.userFilter = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<'DUE_DATE' | 'PRIORITY'>) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortDirection = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.currentPage = 1;
      })
      .addCase(updateTask.fulfilled, () => {
        // Task list will be refetched
      })
      .addCase(deleteTask.fulfilled, () => {
        // Task list will be refetched
      })
      .addCase(markTaskCompleted.fulfilled, () => {
        // Task list will be refetched
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  setStatusFilter,
  setPriorityFilter,
  setUserFilter,
  setSortBy,
  setSortDirection,
  setSearchQuery,
  clearError,
} = taskSlice.actions;

export default taskSlice.reducer;
