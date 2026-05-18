import { create } from 'zustand';
import axios from 'axios';
import api from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  isAuthChecked: false,
  error: null,

  login: async (login: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post('/auth/login', { login, password });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;

      set({
        error:
          status === 401
            ? 'Неправильний логін або пароль'
            : 'Помилка входу',
        isLoading: false,
        isAuthChecked: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      user: null,
      isAuthenticated: false,
      isAuthChecked: true,
      error: null,
    });
  },

  loadProfile: async () => {
    const { data } = await api.get('/auth/profile');

    set({
      user: data,
      isAuthenticated: true,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isAuthChecked: true,
      });
      return;
    }

    try {
      const { data } = await api.get('/auth/profile');

      set({
        user: data,
        isAuthenticated: true,
        isAuthChecked: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
          user: null,
          isAuthenticated: false,
          isAuthChecked: true,
        });

        return;
      }

      set({
        user: null,
        isAuthenticated: true,
        isAuthChecked: true,
      });
    }
  },
}));
