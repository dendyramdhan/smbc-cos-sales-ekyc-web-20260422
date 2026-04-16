import { apiClient } from '@/lib/axios/instances';

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
});
