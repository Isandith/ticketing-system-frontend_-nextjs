import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ToastState } from '@/lib/types';

/**
 * Props for transient feedback notifications.
 */
interface ToastProps {
  toast: ToastState | null;
}

/**
 * Floating toast notification for success or error messages.
 */
export default function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] animate-fade-in-up">
      <div
        className={`rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2 text-white text-sm font-medium ${
          toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
