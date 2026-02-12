import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const authApi = {
  getProfile: () => api.get('/auth/profile'),
};

export const leavesApi = {
  create: (data: any) => 
    api.post('/leaves', data),
    
  getMyRequests: () => 
    api.get('/leaves/me'),
    
  getPending: () => 
    api.get('/leaves/pending'),

  getAll: () =>
    api.get('/leaves/all'),
    
  updateStatus: (id: string, status: string) => 
    api.patch(`/leaves/${id}/status`, { status }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  updateLeaveBalance: (id: string, balance: number) => 
    api.patch(`/admin/users/${id}/leave-balance`, { leaveBalance: balance }),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  updateEmployee: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
  getDepartments: () => api.get('/users/departments'),
};
