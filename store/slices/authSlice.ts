import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      storage.setUser(action.payload.user);
      storage.setAccessToken(action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      storage.clearUser();
      storage.clearAccessToken();
    },
    restoreAuth: (state) => {
      const storedUser = storage.getUser();
      const storedToken = storage.getAccessToken();
      if (storedUser && storedToken) {
        state.user = storedUser;
        state.accessToken = storedToken;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
