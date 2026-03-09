'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownUp,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';
import TaskCard from '@/components/dashboard/TaskCard';
import AdminRegistrationModal from '@/components/dashboard/modals/AdminRegistrationModal';
import DeleteConfirmModal from '@/components/dashboard/modals/DeleteConfirmModal';
import TaskFormModal from '@/components/dashboard/modals/TaskFormModal';
import Toast from '@/components/ui/Toast';
import { Priority, Status, Task, ToastState } from '@/lib/types';
import { registerAdmin } from '@/lib/Services/authentication_Services';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  fetchTasks,
  fetchUsers,
  createTask as createTaskThunk,
  updateTask as updateTaskThunk,
  deleteTask as deleteTaskThunk,
  markTaskCompleted as markTaskCompletedThunk,
  setCurrentPage,
  setPageSize,
  setStatusFilter,
  setPriorityFilter,
  setUserFilter,
  setSortBy,
  setSortDirection,
  setSearchQuery,
} from '@/store/slices/taskSlice';

/**
 * Main authenticated dashboard with task listing, filtering, pagination, and task actions.
 */
export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const {
    tasks,
    users,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    statusFilter,
    priorityFilter,
    userFilter,
    sortBy,
    sortDirection,
    searchQuery,
  } = useAppSelector((state) => state.tasks);

  // Local state
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteModalTaskId, setDeleteModalTaskId] = useState<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    // Fetch tasks when filters or pagination changes
    dispatch(fetchTasks());
    
    // Fetch users if ADMIN
    if (user.role === 'ADMIN') {
      dispatch(fetchUsers());
    }
  }, [
    dispatch,
    router,
    user,
    isAuthenticated,
    mounted,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    statusFilter,
    priorityFilter,
    userFilter,
  ]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks;
    }

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query),
    );
  }, [tasks, searchQuery]);

  const stats = {
    total: totalElements,
    todo: tasks.filter((task) => task.status === 'TODO').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    done: tasks.filter((task) => task.status === 'DONE').length,
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await dispatch(updateTaskThunk({
          taskId: editingTask.id,
          taskData: {
            title: taskData.title || editingTask.title,
            description: taskData.description || editingTask.description,
            status: taskData.status || editingTask.status,
            priority: taskData.priority || editingTask.priority,
            dueDate: taskData.dueDate || editingTask.dueDate,
          },
        })).unwrap();
        await dispatch(fetchTasks());
        showToast('Task updated successfully');
      } else {
        await dispatch(createTaskThunk({
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'TODO',
          priority: taskData.priority || 'MEDIUM',
          dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        })).unwrap();
        await dispatch(fetchTasks());
        showToast('Task created successfully');
      }
      setIsFormModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await dispatch(deleteTaskThunk(taskId)).unwrap();
      await dispatch(fetchTasks());
      setDeleteModalTaskId(null);
      showToast('Task deleted');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete task', 'error');
    }
  };

  const handleMarkComplete = async (taskId: number) => {
    try {
      await dispatch(markTaskCompletedThunk(taskId)).unwrap();
      await dispatch(fetchTasks());
      showToast('Task marked as complete');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update task', 'error');
    }
  };

  const handleRegisterAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!accessToken) {
      showToast('Session expired. Please log in again.', 'error');
      dispatch(logout());
      router.push('/login');
      return;
    }

    try {
      setIsAdminSubmitting(true);
      const payload = {
        username: String(formData.get('username') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        password: String(formData.get('password') || ''),
        role: 'ADMIN' as const,
      };

      await registerAdmin(payload, accessToken);
      await dispatch(fetchUsers());
      showToast(`Admin ${payload.username} registered successfully!`);
      setIsAdminModalOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to register admin', 'error');
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // Prevent hydration mismatch by only rendering after client-side mount
  if (!mounted) {
    return null;
  }

  // Redirect to login if no user (will happen in useEffect, but prevent flash of content)
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-bold text-xl text-gray-900">TaskFlow</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ml-2">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                  className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-900 mt-1">Manage your tasks and stay organized.</p>
            </div>
            <div className="flex space-x-3">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> New Admin
                </button>
              )}
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> New Task
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Tasks',
                value: stats.total,
                icon: LayoutDashboard,
                color: 'text-blue-600',
                bg: 'bg-blue-100',
              },
              { label: 'To Do', value: stats.todo, icon: Circle, color: 'text-gray-600', bg: 'bg-gray-100' },
              {
                label: 'In Progress',
                value: stats.inProgress,
                icon: Clock,
                color: 'text-amber-600',
                bg: 'bg-amber-100',
              },
              {
                label: 'Completed',
                value: stats.done,
                icon: CheckCircle2,
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4"
              >
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {user.role === 'ADMIN' && users.length > 0 && (
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <select
                    value={userFilter}
                    onChange={(e) => {
                      dispatch(setCurrentPage(1));
                      dispatch(setUserFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)));
                    }}
                    aria-label="Filter tasks by user"
                    title="Filter tasks by user"
                    className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="ALL">All Users</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    dispatch(setCurrentPage(1));
                    dispatch(setPriorityFilter(e.target.value as Priority | 'ALL'));
                  }}
                  aria-label="Filter tasks by priority"
                  title="Filter tasks by priority"
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    dispatch(setCurrentPage(1));
                    dispatch(setStatusFilter(e.target.value as Status | 'ALL'));
                  }}
                  aria-label="Filter tasks by status"
                  title="Filter tasks by status"
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowDownUp className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    dispatch(setCurrentPage(1));
                    dispatch(setSortBy(e.target.value as 'DUE_DATE' | 'PRIORITY'));
                  }}
                  aria-label="Sort tasks by field"
                  title="Sort tasks by field"
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="DUE_DATE">Sort by Date</option>
                  <option value="PRIORITY">Sort by Priority</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowDownUp className="h-4 w-4 text-gray-500" />
                <select
                  value={sortDirection}
                  onChange={(e) => {
                    dispatch(setCurrentPage(1));
                    dispatch(setSortDirection(e.target.value as 'asc' | 'desc'));
                  }}
                  aria-label="Sort direction"
                  title="Sort direction"
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Loading tasks...</h3>
              <p className="text-gray-500">Please wait while we fetch your tasks.</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load tasks</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchTasks())}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm"
              >
                Retry
              </button>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(selectedTask) => {
                    setEditingTask(selectedTask);
                    setIsFormModalOpen(true);
                  }}
                  onDelete={setDeleteModalTaskId}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
              <p className="text-gray-500 mb-4">Get started by creating a new task or adjust your filters.</p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Task
              </button>
            </div>
          )}

          {!isLoading && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} | Total tasks: {totalElements}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    dispatch(setCurrentPage(1));
                    dispatch(setPageSize(Number(e.target.value)));
                  }}
                  aria-label="Tasks per page"
                  title="Tasks per page"
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
                  className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))}
                  className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>

        <TaskFormModal
          isOpen={isFormModalOpen}
          editingTask={editingTask}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />

        <AdminRegistrationModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onSubmit={handleRegisterAdmin}
          isSubmitting={isAdminSubmitting}
        />

        <DeleteConfirmModal
          isOpen={Boolean(deleteModalTaskId)}
          onCancel={() => setDeleteModalTaskId(null)}
          onConfirm={() => {
            if (deleteModalTaskId) {
              handleDeleteTask(deleteModalTaskId);
            }
          }}
        />
      </div>
      <Toast toast={toast} />
    </>
  );
}
