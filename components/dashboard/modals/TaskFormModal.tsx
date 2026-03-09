import React from 'react';
import { X } from 'lucide-react';
import { Priority, Status, Task } from '@/lib/types';

/**
 * Props for the create/edit task modal form.
 */
interface TaskFormModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
}

/**
 * Modal form used for creating a new task or editing an existing one.
 */
export default function TaskFormModal({
  isOpen,
  editingTask,
  onClose,
  onSave,
}: TaskFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task form modal"
            title="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSave({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              status: formData.get('status') as Status,
              priority: formData.get('priority') as Priority,
              dueDate: formData.get('dueDate') as string,
            });
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="task-title"
              required
              name="title"
              title="Task title"
              defaultValue={editingTask?.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Task title"
            />
          </div>
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="task-description"
              required
              name="description"
              title="Task description"
              defaultValue={editingTask?.description}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Task details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="task-status"
                name="status"
                title="Task status"
                defaultValue={editingTask?.status || 'TODO'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="task-priority"
                name="priority"
                title="Task priority"
                defaultValue={editingTask?.priority || 'MEDIUM'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              id="task-due-date"
              required
              type="date"
              name="dueDate"
              title="Task due date"
              defaultValue={editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
