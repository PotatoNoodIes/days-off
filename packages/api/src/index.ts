import axios from 'axios';

// Ensure this matches your local IP if testing on physical device, 
// or use "10.0.2.2" for Android emulator or "localhost" for iOS/Web.
const BASE_URL = 'http://10.0.0.51:3000'; 

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
};

export const attendanceApi = {
  clockIn: (location?: any) => 
    api.post('/attendance/clock-in', { location }),
  
  clockOut: (location?: any) => 
    api.post('/attendance/clock-out', { location }),
    
  getStatus: () => 
    api.get('/attendance/status'),
    
  getHistory: () => 
    api.get('/attendance/history'),
};

export const leavesApi = {
  create: (data: any) => 
    api.post('/leaves', data),
    
  getMyRequests: () => 
    api.get('/leaves/me'),
    
  getPending: () => 
    api.get('/leaves/pending'),
    
  updateStatus: (id: string, status: string) => 
    api.patch(`/leaves/${id}/status`, { status }),
};

export const schedulesApi = {
  getAll: (start: string, end: string) => api.get('/schedules', { params: { start, end } }),
  create: (data: any) => api.post('/schedules', data),
  update: (id: string, data: any) => api.patch(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getWorkforceStatus: () => api.get('/admin/workforce-status'),
  getSchedules: (start: string, end: string) => api.get('/schedules', { params: { start, end } }),
  updateTimeEntry: (id: string, data: any) => api.patch(`/admin/time-entries/${id}`, data),
  createTimeEntry: (data: any) => api.post('/admin/time-entries', data),
};
