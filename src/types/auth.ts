export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  username: string;
  access_token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  username: string | null;
  accessToken: string | null;
} 