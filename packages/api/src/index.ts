import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
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
  delete: (id: string) => api.delete(`/users/${id}`),
};
