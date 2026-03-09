import React from 'react';
import { AlertCircle, UserPlus, X } from 'lucide-react';

interface AdminRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

export default function AdminRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AdminRegistrationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 text-gray-700 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Register New Admin</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm p-3 rounded-lg mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              This will create an account with full <strong>ADMIN</strong> privileges, allowing them to view and
              manage all tasks across the system.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              required
              name="username"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin_username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              name="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Secure password"
            />
          </div>
          <input type="hidden" name="role" value="ADMIN" />

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
