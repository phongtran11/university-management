import { TokenResponse } from "../api";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email_verified: boolean;
  phone_number?: string | null;
  date_of_birth?: string | null;
  gender?: number | null;
  avatar_url?: string | null;
  status?: number;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  date_of_birth?: Date | null;
  gender?: number | null;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  tokens?: TokenResponse;
}

export interface VerifyEmailResult {
  success: boolean;
  error?: string;
}

export interface CheckEmailVerifiedResult {
  success: boolean;
  verified: boolean;
  error?: string;
}

export interface LogoutResult {
  success: boolean;
  error?: string;
}

export interface GetUserResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface RefreshTokenResult {
  success: boolean;
  error?: string;
}
