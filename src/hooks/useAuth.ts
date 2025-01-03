import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import { LoginCredentials } from "../types/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, clearUser } = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const { userId, email, username, access_token } = response;
      setUser(userId, email, username, access_token);
      return true;
    } catch (error) {
      toast.error("Login failed. Please check your credentials");
      return false;
    }
  }, [setUser]);

  const register = useCallback(async (data: LoginCredentials & { username: string }) => {
    try {
      await authService.register(data);
      toast.success("Registration successful! Please log in");
      navigate("/login");
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again");
      return false;
    }
  }, [navigate]);

  const loginWithGoogle = useCallback(() => {
    authService.googleAuth();
  }, []);

  return {
    login,
    register,
    clearUser,
    loginWithGoogle
  };
}; 