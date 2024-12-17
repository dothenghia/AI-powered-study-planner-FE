import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthStore = {
  isAuthenticated: boolean;
  email: string | null;
  username: string | null;
  accessToken: string | null;

  setUser: (email: string | null, username: string | null, accessToken: string) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: "",
      username: "",
      accessToken: null,

      setUser: (email, username, accessToken) => {
        set({
          isAuthenticated: true,
          email,
          username,
          accessToken,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          email: "",
          username: "",
          accessToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
