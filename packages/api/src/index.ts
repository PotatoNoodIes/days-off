import axios from 'axios';

// Ensure this matches your local IP if testing on physical device, 
// or use "10.0.2.2" for Android emulator or "localhost" for iOS/Web.
const BASE_URL = 'http://localhost:3000'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const attendanceApi = {
  clockIn: (userId: string, location?: any) => 
    api.post('/attendance/clock-in', { userId, location }),
  
  clockOut: (userId: string, location?: any) => 
    api.post('/attendance/clock-out', { userId, location }),
    
  getStatus: (userId: string) => 
    api.get(`/attendance/status/${userId}`),
    
  getHistory: (userId: string) => 
    api.get(`/attendance/history/${userId}`),
};

export const leavesApi = {
  create: (userId: string, data: any) => 
    api.post('/leaves', { ...data, userId }),
    
  getMyRequests: (userId: string) => 
    api.get(`/leaves/me/${userId}`),
    
  getPending: () => 
    api.get('/leaves/pending'),
    
  updateStatus: (id: string, status: string, reviewerId: string) => 
    api.patch(`/leaves/${id}/status`, { status, reviewerId }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};
