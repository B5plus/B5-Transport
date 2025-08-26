import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, APP_CONFIG } from '../config/api';
import { 
  User, 
  VehicleRequest, 
  LoginRequest, 
  RegisterRequest, 
  CreateVehicleRequest,
  DashboardStats,
  ApiResponse,
  PaginatedResponse
} from '../types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
      localStorage.removeItem(APP_CONFIG.USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await api.post(API_CONFIG.ENDPOINTS.LOGIN, data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await api.post(API_CONFIG.ENDPOINTS.REGISTER, data);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await api.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post(API_CONFIG.ENDPOINTS.LOGOUT);
  }
};

export const vehicleAPI = {
  createRequest: async (data: CreateVehicleRequest): Promise<VehicleRequest> => {
    const response: AxiosResponse<ApiResponse<{ request: VehicleRequest }>> = 
      await api.post(API_CONFIG.ENDPOINTS.CREATE_REQUEST, data);
    return response.data.data.request;
  },

  getMyRequests: async (page = 1, limit = APP_CONFIG.PAGINATION.DEFAULT_LIMIT): Promise<PaginatedResponse<VehicleRequest>> => {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<VehicleRequest>>> = 
      await api.get(`${API_CONFIG.ENDPOINTS.MY_REQUESTS}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getRequest: async (id: number): Promise<VehicleRequest> => {
    const response: AxiosResponse<ApiResponse<{ request: VehicleRequest }>> = 
      await api.get(`${API_CONFIG.ENDPOINTS.GET_REQUEST}/${id}`);
    return response.data.data.request;
  }
};

export const adminAPI = {
  getAllRequests: async (page = 1, limit = APP_CONFIG.PAGINATION.DEFAULT_LIMIT, status?: string): Promise<PaginatedResponse<VehicleRequest>> => {
    let url = `${API_CONFIG.ENDPOINTS.ALL_REQUESTS}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response: AxiosResponse<ApiResponse<PaginatedResponse<VehicleRequest>>> = 
      await api.get(url);
    return response.data.data;
  },

  getRequest: async (id: number): Promise<VehicleRequest> => {
    const response: AxiosResponse<ApiResponse<{ request: VehicleRequest }>> = 
      await api.get(`${API_CONFIG.ENDPOINTS.ALL_REQUESTS.replace('/requests', '')}/request/${id}`);
    return response.data.data.request;
  },

  markAsReturned: async (id: number): Promise<VehicleRequest> => {
    const response: AxiosResponse<ApiResponse<{ request: VehicleRequest }>> = 
      await api.patch(`${API_CONFIG.ENDPOINTS.MARK_RETURNED}/${id}/return`);
    return response.data.data.request;
  },

  getDashboardStats: async (): Promise<{ stats: DashboardStats; recentRequests: VehicleRequest[] }> => {
    const response: AxiosResponse<ApiResponse<{ stats: DashboardStats; recentRequests: VehicleRequest[] }>> = 
      await api.get(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
    return response.data.data;
  }
};

export default api;
