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
import { generateId } from '@/lib/mockData';
import { Priority, Status, Task, ToastState, User } from '@/lib/types';
import { storage } from '@/lib/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<User | null>(() => storage.getUser());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [toast, setToast] = useState<ToastState | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'DUE_DATE' | 'PRIORITY'>('DUE_DATE');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteModalTaskId, setDeleteModalTaskId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [router, user]);

  const filteredAndSortedTasks = useMemo(() => {
    const result = [...tasks]
      .filter((task) => {
        if (!searchQuery) {
          return true;
        }

        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      })
      .filter((task) => statusFilter === 'ALL' || task.status === statusFilter)
      .sort((a, b) => {
        if (sortBy === 'DUE_DATE') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        const priorityWeight: Record<Priority, number> = {
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });

    return result;
  }, [tasks, searchQuery, sortBy, statusFilter]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'TODO').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    done: tasks.filter((task) => task.status === 'DONE').length,
  };

  const syncTasks = (nextTasks: Task[]) => {
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
          : task,
      );
      syncTasks(updatedTasks);
      showToast('Task updated successfully');
    } else {
      const newTask: Task = {
        id: generateId(),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'TODO',
        priority: taskData.priority || 'MEDIUM',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      syncTasks([...tasks, newTask]);
      showToast('Task created successfully');
    }

    setIsFormModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    syncTasks(tasks.filter((task) => task.id !== taskId));
    setDeleteModalTaskId(null);
    showToast('Task deleted');
  };

  const handleMarkComplete = (taskId: string) => {
    const updatedTasks: Task[] = tasks.map((task): Task =>
      task.id === taskId
        ? { ...task, status: 'DONE', updatedAt: new Date().toISOString() }
        : task,
    );
    syncTasks(updatedTasks);
    showToast('Task marked as complete');
  };

  const handleRegisterAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAdminData = Object.fromEntries(formData.entries());

    console.log('Registering Admin:', newAdminData);
    setTimeout(() => {
      showToast(`Admin ${newAdminData.username} registered successfully!`);
      setIsAdminModalOpen(false);
    }, 600);
  };

  const handleLogout = () => {
    storage.clearUser();
    router.push('/login');
  };

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
              <p className="text-sm text-gray-500 mt-1">Manage your tasks and stay organized.</p>
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
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                  onChange={(e) => setSortBy(e.target.value as 'DUE_DATE' | 'PRIORITY')}
                  className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="DUE_DATE">Sort by Date</option>
                  <option value="PRIORITY">Sort by Priority</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAndSortedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTasks.map((task) => (
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
