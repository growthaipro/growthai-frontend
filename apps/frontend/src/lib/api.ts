import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle token expiry
apiClient.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  },
);

// ─── API endpoints ────────────────────────────────────────────

export const campaignApi = {
  list: (params?: any) => apiClient.get('/campaigns', { params }),
  get: (id: string) => apiClient.get(`/campaigns/${id}`),
  create: (data: any) => apiClient.post('/campaigns', data),
  update: (id: string, data: any) => apiClient.put(`/campaigns/${id}`, data),
  start: (id: string) => apiClient.patch(`/campaigns/${id}/start`),
  pause: (id: string) => apiClient.patch(`/campaigns/${id}/pause`),
  metrics: (id: string, days?: number) => apiClient.get(`/campaigns/${id}/metrics`, { params: { days } }),
  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
};

export const creativeApi = {
  list: (campaignId?: string) => apiClient.get('/creatives', { params: { campaignId } }),
  get: (id: string) => apiClient.get(`/creatives/${id}`),
  create: (data: any) => apiClient.post('/creatives', data),
  delete: (id: string) => apiClient.delete(`/creatives/${id}`),
};

export const metricsApi = {
  dashboard: () => apiClient.get('/metrics/dashboard'),
  campaignMetrics: (campaignId: string) => apiClient.get(`/metrics/campaign/${campaignId}`),
};

export const optimizationApi = {
  logs: (params?: any) => apiClient.get('/optimization/logs', { params }),
  trigger: (campaignId: string) => apiClient.post(`/optimization/trigger/${campaignId}`),
};

export const authApi = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/auth/register', data),
};
