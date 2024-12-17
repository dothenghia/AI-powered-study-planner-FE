import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthStore = {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  username: string | null;
  accessToken: string | null;

  setUser: (userId: string, email: string, username: string, accessToken: string) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      email: "",
      username: "",
      accessToken: null,

      setUser: (userId, email, username, accessToken) => {
        set({
          isAuthenticated: true,
          userId,
          email,
          username,
          accessToken,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          userId: null,
          email: "",
          username: "",
          accessToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
