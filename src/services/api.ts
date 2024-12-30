import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores';

const createApiInstance = () => {
  const apiUrl = 'https://ai-powered-study-planner-be.onrender.com';
  
  const instance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createApiInstance(); 