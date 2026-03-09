'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { restoreAuth } from '@/store/slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore auth state from localStorage on mount
    store.dispatch(restoreAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
