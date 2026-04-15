import { API_CONFIG } from '@/constants/apiConfig';
import { createAxiosInstance } from './createInstance';
import { setupInterceptors } from './interceptors';

/**
 * Pre-configured axios instance with auth interceptors.
 *
 * Usage in service layer:
 * ```ts
 * import { apiClient } from '@/lib/axios';
 * apiClient.get('/users');
 * ```
 */
export const apiClient = setupInterceptors(
  createAxiosInstance({
    label: 'apiClient',
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withAuth: true,
  }),
);
