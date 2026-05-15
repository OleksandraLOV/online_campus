import axios from 'axios';
import type { Material, Submission } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export const filesApi = {
  uploadMaterial: async (caId: string, title: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    return api.post<Material>(`/courses/${caId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  submitAssignment: async (assignmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<Submission>(`/courses/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteFile: async (fileId: string) => {
    return api.delete(`/files/${fileId}`);
  }
};
export default api;
