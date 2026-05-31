import { request } from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterParams {
  name: string;
  email: string;
  password?: string;
}

export interface LoginParams {
  email: string;
  password?: string;
}

export const authApi = {
  register: (params: RegisterParams) => 
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: params,
    }),

  login: (params: LoginParams) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: params,
    }),
};
