import { api } from './api';
import { LoginCredentials, AuthResponse } from '../types/auth';

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
    window.location.href = `${import.meta.env.VITE_API_URL}/google`;
  }
}; 