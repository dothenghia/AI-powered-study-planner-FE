import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types/auth';

interface AuthStore extends AuthState {
  setUser: (userId: string, email: string, username: string, accessToken: string) => void;
  clearUser: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  username: null,
  accessToken: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (userId, email, username, accessToken) => 
        set({
          isAuthenticated: true,
          userId,
          email,
          username,
          accessToken,
        }),
      clearUser: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    }
  )
);
