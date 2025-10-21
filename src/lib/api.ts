import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CalorieRequest,
  CalorieResponse,
  ApiError,
} from './types';

const API_BASE_URL = 'https://flybackend-misty-feather-6458.fly.dev';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log('API Request:', config.url); // Debug requests
  return config;
});

// Old approach using fetch instead of axios
// const apiCall = async (endpoint: string, options: RequestInit) => {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   });
//   return response.json();
// };

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only auto-redirect on 401 for protected routes, not auth routes
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/')
    ) {
      // Token expired or invalid on protected routes
      Cookies.remove('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Calorie API functions
export const calorieApi = {
  async getCalories(data: CalorieRequest): Promise<CalorieResponse> {
    try {
      const response = await api.post<CalorieResponse>('/get-calories', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handler
function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // Try to extract the actual server error message in different formats
    let message = 'An error occurred';

    if (error.response?.data) {
      // Try different possible server response formats
      const responseData = error.response.data;
      message =
        responseData.message ||
        responseData.error ||
        responseData.detail ||
        responseData.msg ||
        JSON.stringify(responseData);
    } else if (error.message) {
      message = error.message;
    }

    // Log the full error for debugging
    console.log('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    return {
      message,
      status: error.response?.status,
    };
  }
  return {
    message: 'An unexpected error occurred',
  };
}

export default api;
