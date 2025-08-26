export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface VehicleRequest {
  id: number;
  request_number: string;
  request_date: string;
  vehicle_type: string;
  vehicle_number: string;
  location: string;
  taken_time: string;
  estimated_usage: string;
  department: string;
  remarks: string;
  status: 'pending' | 'returned';
  returned_at?: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  department: string;
  role?: 'user' | 'admin';
}

export interface CreateVehicleRequest {
  vehicle_type: string;
  vehicle_number: string;
  location: string;
  taken_time: string;
  estimated_usage: string;
  department: string;
  remarks: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  returnedRequests: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  requests: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}
