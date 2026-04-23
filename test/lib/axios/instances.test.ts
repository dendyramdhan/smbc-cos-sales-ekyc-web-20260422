import { apiClient, onboardingApiClient, ekycParameterApiClient } from '@/lib/axios/instances';

describe('instances', () => {
  describe('apiClient', () => {
    it('should be an axios instance', () => {
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
      expect(typeof apiClient.put).toBe('function');
      expect(typeof apiClient.patch).toBe('function');
      expect(typeof apiClient.delete).toBe('function');
    });

    it('should have configured baseURL from API_CONFIG', () => {
      // API_CONFIG.BASE_URL defaults to '/api' when env not set
      expect(apiClient.defaults.baseURL).toBe('/api');
    });

    it('should have configured timeout from API_CONFIG', () => {
      expect(apiClient.defaults.timeout).toBe(15_000);
    });

    it('should have interceptors registered', () => {
      const reqHandlers = (apiClient.interceptors.request as unknown as { handlers: unknown[] }).handlers;
      const resHandlers = (apiClient.interceptors.response as unknown as { handlers: unknown[] }).handlers;

      expect(reqHandlers.length).toBeGreaterThanOrEqual(1);
      expect(resHandlers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('onboardingApiClient', () => {
    it('should be an axios instance', () => {
      expect(onboardingApiClient).toBeDefined();
      expect(typeof onboardingApiClient.get).toBe('function');
      expect(typeof onboardingApiClient.post).toBe('function');
    });

    it('should have configured baseURL for onboarding', () => {
      expect(onboardingApiClient.defaults.baseURL).toBe('/api/onboarding');
    });

    it('should have configured timeout from API_CONFIG', () => {
      expect(onboardingApiClient.defaults.timeout).toBe(15_000);
    });

    it('should have interceptors registered', () => {
      const reqHandlers = (onboardingApiClient.interceptors.request as unknown as { handlers: unknown[] }).handlers;
      const resHandlers = (onboardingApiClient.interceptors.response as unknown as { handlers: unknown[] }).handlers;

      expect(reqHandlers.length).toBeGreaterThanOrEqual(1);
      expect(resHandlers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('ekycParameterApiClient', () => {
    it('should be an axios instance', () => {
      expect(ekycParameterApiClient).toBeDefined();
      expect(typeof ekycParameterApiClient.get).toBe('function');
      expect(typeof ekycParameterApiClient.post).toBe('function');
    });

    it('should have configured baseURL for eKYC parameters', () => {
      expect(ekycParameterApiClient.defaults.baseURL).toBe('/api/ekyc-param');
    });

    it('should have configured timeout from API_CONFIG', () => {
      expect(ekycParameterApiClient.defaults.timeout).toBe(15_000);
    });

    it('should have interceptors registered', () => {
      const reqHandlers = (ekycParameterApiClient.interceptors.request as unknown as { handlers: unknown[] }).handlers;
      const resHandlers = (ekycParameterApiClient.interceptors.response as unknown as { handlers: unknown[] }).handlers;

      expect(reqHandlers.length).toBeGreaterThanOrEqual(1);
      expect(resHandlers.length).toBeGreaterThanOrEqual(1);
    });
  });
});
