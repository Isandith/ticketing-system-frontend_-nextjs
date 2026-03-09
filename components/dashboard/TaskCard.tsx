import { Check, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMarkComplete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMarkComplete,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{task.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              task.status === 'TODO'
                ? 'bg-slate-50 text-slate-700 border-slate-200'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {task.status === 'DONE' && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {task.status.replace('_', ' ')}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              task.priority === 'HIGH'
                ? 'bg-red-50 text-red-700 border-red-200'
                : task.priority === 'MEDIUM'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {task.priority} Priority
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5 mr-1" />
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center">
        <button
          onClick={() => onMarkComplete(task.id)}
          disabled={task.status === 'DONE'}
          className={`text-xs font-medium flex items-center px-2 py-1 rounded transition-colors ${
            task.status === 'DONE'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          <Check className="w-4 h-4 mr-1" />
          {task.status === 'DONE' ? 'Completed' : 'Mark Done'}
        </button>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
