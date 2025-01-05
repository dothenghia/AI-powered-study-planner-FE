import { api } from './api';
import { LoginCredentials, AuthResponse } from '../types/auth';
import { API_URL } from '../constants/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (userData: LoginCredentials & { username: string }): Promise<AuthResponse> => {
    const response = await api.post('/user/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  googleAuth: () => {
    window.location.href = `${API_URL}/google`;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/user/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (userId: string | null, password: string, token: string | null) => {
    const response = await api.post('/user/update-password', {
      userId,
      password,
      token
    });
    return response.data;
  },

  verifyEmail: async (token: string | null) => {
    const response = await api.post('/verify-email', {
      token
    });
    return response.data;
  }
}; 