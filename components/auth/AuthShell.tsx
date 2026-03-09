import { ReactNode } from 'react';

/**
 * Wrapper props for authentication pages.
 */
interface AuthShellProps {
  children: ReactNode;
}

/**
 * Shared centered container layout used by login and registration pages.
 */
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}
