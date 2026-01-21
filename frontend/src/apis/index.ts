import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL: baseUrl,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear it
      localStorage.removeItem('authToken');
      // Optionally redirect to login, but let the component handle it
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (data: { email: string; password: string }) =>
  http.post('/api/v1/auth/login', data);

export const signup = (data: {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  password: string;
  passwordConfirm: string;
}) => http.post('/api/v1/auth/signup', data);

export const getMe = () => http.get('/api/v1/auth/me');

// Employee APIs
export const getEmployees = (params?: any) =>
  http.get('/api/v1/employees', { params });

export const getEmployee = (id: string) =>
  http.get(`/api/v1/employees/${id}`);

export const createEmployee = (data: {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  password: string;
  passwordConfirm: string;
}) => http.post('/api/v1/employees', data);

export const deleteEmployee = (id: string) =>
  http.delete(`/api/v1/employees/${id}`);

// Attendance APIs
export const getAttendance = (employeeId: string, params?: any) =>
  http.get(`/api/v1/attendance/${employeeId}`, { params });

export const markAttendance = (data: {
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent';
}) => http.post('/api/v1/attendance', data);