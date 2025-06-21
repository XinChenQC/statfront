import api from './axios';
import type { ApiResponse, User, Task } from '../types';

export const userService = {
  getUsers: async (password: string): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/api/users', { password });
    return response.data;
  },
  downloadUsers: async (password: string): Promise<Blob> => {
    const response = await api.post('/api/users/download', { password }, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export const taskService = {
  getTasks: async (password: string): Promise<ApiResponse<Task>> => {
    const response = await api.post<ApiResponse<Task>>('/api/tasks', { password });
    return response.data;
  },
  downloadTasks: async (password: string): Promise<Blob> => {
    const response = await api.post('/api/tasks/download', { password }, {
      responseType: 'blob'
    });
    return response.data;
  }
}; 