import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import { LoginCredentials } from "../types/auth";
import { AxiosError } from "axios";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const { userId, email, username, access_token } = response;
      setUser(userId, email, username, access_token);
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else { 
        toast.error("Login failed. Please check your credentials");
      }
      return false;
    }
  }, [setUser]);

  const register = useCallback(async (data: LoginCredentials & { username: string }) => {
    try {
      await authService.register(data);
      toast.success("Registration successful! Please verify your email before logging in", {
        autoClose: 5000,
      });
      navigate("/login");
      return true;
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Registration failed");
      }
      return false;
    }
  }, [navigate]);

  const loginWithGoogle = useCallback(() => {
    authService.googleAuth();
  }, []);

  const sendResetPasswordLink = useCallback(async (email: string) => {
    try {
      await authService.forgotPassword(email);
      toast.success("Reset password link sent to email");
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else { 
        toast.error("Failed to send reset password link");
      }
      return false;
    }
  }, []);

  const resetPassword = async (userId: string | null, password: string, token: string | null) => {
    try {
      console.log(userId, password, token);
      await authService.resetPassword(userId, password, token);
      toast.success("Password reset successful");
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else { 
        toast.error("Failed to reset password");
      }
      return false;
    }
  }
  const verifyEmail = async (token: string | null) => {
    try {
      setIsLoading(true);
      await authService.verifyEmail(token);
      setIsLoading(false);
      toast.success("Email verified successfully");
      return true;
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else { 
        toast.error("Failed to verify email"); 
      }
      return false;
    }
  }

  return {
    login,
    register,
    clearUser,
    loginWithGoogle,
    sendResetPasswordLink,
    resetPassword,
    verifyEmail,
    isLoading
  };
}; 