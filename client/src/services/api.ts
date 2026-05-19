import axios from 'axios';

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
    const uploadRes = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const fileId = uploadRes.data.fileId;
    const materialRes = await api.post(`/courses/${caId}/materials`, {
      title: title,
      fileIds: [fileId],
    });
    return materialRes.data;
  },

submitAssignment: async (assignmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const fileId = uploadRes.data.fileId;
    const submitRes = await api.post(`/courses/assignments/${assignmentId}/submit`, {
      fileIds: [fileId],
    });
    return submitRes.data;
  },
  
  deleteFile: async (fileId: string) => {
    return api.delete(`/files/${fileId}`);
  }
};
export default api;
