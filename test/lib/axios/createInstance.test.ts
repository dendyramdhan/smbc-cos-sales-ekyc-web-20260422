import { createAxiosInstance } from '@/lib/axios/createInstance';

describe('createAxiosInstance', () => {
  it('should create an axios instance with default config', () => {
    const instance = createAxiosInstance();

    expect(instance).toBeDefined();
    expect(instance.defaults.timeout).toBe(15000);
    expect(instance.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should allow overriding timeout', () => {
    const instance = createAxiosInstance({ timeout: 30000 });

    expect(instance.defaults.timeout).toBe(30000);
  });

  it('should allow overriding baseURL', () => {
    const instance = createAxiosInstance({ baseURL: 'https://api.example.com' });

    expect(instance.defaults.baseURL).toBe('https://api.example.com');
  });

  it('should strip custom properties (label, withAuth, withLogging) and not pass them to axios', () => {
    const instance = createAxiosInstance({
      label: 'testClient',
      withAuth: true,
      withLogging: true,
      baseURL: '/test',
    });

    expect(instance.defaults.baseURL).toBe('/test');
    // Custom props should not leak into axios defaults
    expect((instance.defaults as Record<string, unknown>).label).toBeUndefined();
    expect((instance.defaults as Record<string, unknown>).withAuth).toBeUndefined();
    expect((instance.defaults as Record<string, unknown>).withLogging).toBeUndefined();
  });

  it('should allow adding custom headers', () => {
    const instance = createAxiosInstance({
      headers: { 'X-Custom-Header': 'custom-value' },
    });

    expect(instance.defaults.headers['X-Custom-Header']).toBe('custom-value');
  });
});
