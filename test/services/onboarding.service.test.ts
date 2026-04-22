import type { AxiosInstance } from 'axios';
import { OnboardingService } from '@/services/onboarding.service';
import { CUSTOMER_INFO_MOCK_DATA } from '@/services/__mocks__';

function createMockAxios(): jest.Mocked<AxiosInstance> {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<AxiosInstance>;
}

describe('OnboardingService', () => {
  let mockHttp: jest.Mocked<AxiosInstance>;
  let service: OnboardingService;

  beforeEach(() => {
    mockHttp = createMockAxios();
    service = new OnboardingService(mockHttp);
  });

  describe('getOnboardingData()', () => {
    it('should return ApiResponse with customer info mock data', async () => {
      const result = await service.getOnboardingData('test-id');

      expect(result).toEqual({
        data: { ...CUSTOMER_INFO_MOCK_DATA },
        message: 'SUCCESS',
        status: 0,
      });
    });

    it('should return data matching CustomerInfoData shape', async () => {
      const result = await service.getOnboardingData('any-id');

      expect(result.data).toHaveProperty('customerType');
      expect(result.data).toHaveProperty('capId');
      expect(result.data).toHaveProperty('cifNo');
      expect(result.data).toHaveProperty('customerName');
      expect(result.data).toHaveProperty('generalChecking');
    });

    it('should return status 0 and SUCCESS message', async () => {
      const result = await service.getOnboardingData('id');

      expect(result.status).toBe(0);
      expect(result.message).toBe('SUCCESS');
    });
  });

  describe('constructor', () => {
    it('should accept custom axios instance', () => {
      const customHttp = createMockAxios();
      const customService = new OnboardingService(customHttp);
      expect(customService).toBeInstanceOf(OnboardingService);
    });

    it('should default to onboardingApiClient when no instance provided', () => {
      const defaultService = new OnboardingService();
      expect(defaultService).toBeInstanceOf(OnboardingService);
    });
  });
});
