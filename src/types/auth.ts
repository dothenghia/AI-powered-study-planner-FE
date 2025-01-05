export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  imageUrl: string | null;
} 

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  userId: string;
  password: string;
}
