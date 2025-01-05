import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types/auth';

interface AuthStore extends AuthState {
  setEmail: (email: string | null) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setUsername: (username: string | null) => void;
  setUserId: (userId: string | null) => void;
  setUser: (userId: string, email: string, username: string, accessToken: string, imageUrl?: string) => void;
  clearUser: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  username: null,
  imageUrl: null,
  accessToken: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setEmail: (email: string | null) => set({
        email: email
      }),
      setImageUrl: (imageUrl: string | null) => set({
        imageUrl: imageUrl
      }),
      setUsername: (username: string | null) => set({
        username: username
      }),
      setUserId: (userId: string | null) => set({
        userId: userId
      }),
      setUser: (userId, email, username, accessToken, imageUrl) =>
        set({
          isAuthenticated: true,
          userId,
          email,
          username,
          accessToken,
          imageUrl
        }),
      clearUser: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    }
  )
);
