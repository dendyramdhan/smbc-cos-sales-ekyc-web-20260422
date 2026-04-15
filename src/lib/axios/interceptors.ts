import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// ─── Request Interceptors ────────────────────────────────────────────────────

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

// ─── Response Interceptors ───────────────────────────────────────────────────

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<never> => {
  const status = error.response?.status;

  if (status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  return Promise.reject(error);
};

// ─── Setup ───────────────────────────────────────────────────────────────────

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(onRequest, onRequestError);
  instance.interceptors.response.use(onResponse, onResponseError);
  return instance;
};
