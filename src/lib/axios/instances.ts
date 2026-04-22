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

/**
 * Dedicated axios instance for onboarding domain.
 * Keep config isolated so onboarding-specific headers/baseURL can be adjusted later.
 */
export const onboardingApiClient = setupInterceptors(
  createAxiosInstance({
    label: 'onboardingApiClient',
    baseURL: API_CONFIG.MS_ONBOARDING_API_URL,
    timeout: API_CONFIG.TIMEOUT,
    withAuth: true,
  }),
);

/**
 * Dedicated axios instance for eKYC parameter domain.
 * Keep config isolated so eKYC parameter-specific headers/baseURL can be adjusted later.
 */
export const ekycParameterApiClient = setupInterceptors(
  createAxiosInstance({
    label: 'ekycParameterApiClient',
    baseURL: API_CONFIG.MS_EKYC_PARAMETER_API_URL,
    timeout: API_CONFIG.TIMEOUT,
    withAuth: true,
  }),
);