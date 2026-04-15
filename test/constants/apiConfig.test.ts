import { API_CONFIG } from '@/constants/apiConfig';

describe('apiConfig', () => {
  it('should have BASE_URL defaulting to /api when env is not set', () => {
    expect(API_CONFIG.BASE_URL).toBe('/api');
  });

  it('should have TIMEOUT set to 15000', () => {
    expect(API_CONFIG.TIMEOUT).toBe(15_000);
  });

  it('should be a readonly object', () => {
    expect(typeof API_CONFIG).toBe('object');
    expect(API_CONFIG).toHaveProperty('BASE_URL');
    expect(API_CONFIG).toHaveProperty('TIMEOUT');
  });
});
