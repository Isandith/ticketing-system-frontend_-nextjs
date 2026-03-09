import { Task } from './types';

export const generateId = () => Math.random().toString(36).slice(2, 11);

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Spring Boot Backend',
    description: 'Finish the REST API endpoints and setup JWT authentication.',
    status: 'DONE',
    priority: 'HIGH',
    dueDate: '2026-03-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design Next.js Frontend',
    description: 'Create a clean, modern UI using Tailwind CSS and Lucide icons.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2026-03-25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Write Documentation',
    description: 'Document the API endpoints and setup instructions for the assignment.',
    status: 'TODO',
    priority: 'LOW',
    dueDate: '2026-03-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
