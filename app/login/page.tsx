'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Toast from '@/components/ui/Toast';
import { Role, ToastState } from '@/lib/types';
import { login } from '@/lib/Services/authentication_Services';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('TestUser');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({
        username: username.trim(),
        password,
      });

      const role = (response.role as Role) || 'USER';
      const bearerToken = response.tokenType
        ? `${response.tokenType} ${response.token}`
        : `Bearer ${response.token}`;

      dispatch(setCredentials({
        user: { username: response.username, role },
        accessToken: bearerToken,
      }));
      
      setIsLoading(false);
      showToast(`Logged in as ${role}: ${response.username}`);
      setTimeout(() => router.push('/dashboard'), 400);
    } catch (error) {
      setIsLoading(false);
      showToast(error instanceof Error ? error.message : 'Login failed', 'error');
    }
  };

  return (
    <>
      <AuthShell>
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Mini Task Management System</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center">
          <Link href="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Need an account? Register here
          </Link>
        </div>
      </AuthShell>
      <Toast toast={toast} />
    </>
  );
}
