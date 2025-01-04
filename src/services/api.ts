import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores';
import { API_URL } from '../constants/constants';

const createApiInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
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
        useAuthStore.getState().clearUser();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createApiInstance(); 