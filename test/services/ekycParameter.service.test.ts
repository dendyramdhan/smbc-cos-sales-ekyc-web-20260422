import type { AxiosInstance } from 'axios';
import { EKYCParameterService } from '@/services/ekycParameter.service';
import {
  CUSTOMER_TYPE_MOCK_DATA,
  LEGAL_ENTITY_TYPE_MOCK_DATA,
  LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA,
  LINE_OF_BUSINESS_MOCK_DATA,
  COUNTRY_MOCK_DATA,
  GENERAL_CHECKING_MOCK_DATA,
} from '@/services/__mocks__';

const MOCK_RESPONSES: Record<string, { result: unknown; message: string; status: number }> = {
  '/customer-types': { result: CUSTOMER_TYPE_MOCK_DATA, message: 'SUCCESS', status: 0 },
  '/legal-entity-types': { result: LEGAL_ENTITY_TYPE_MOCK_DATA, message: 'SUCCESS', status: 0 },
  '/legal-entity-characteristics': { result: LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA, message: 'SUCCESS', status: 0 },
  '/line-of-business': { result: LINE_OF_BUSINESS_MOCK_DATA, message: 'SUCCESS', status: 0 },
  '/countries': { result: COUNTRY_MOCK_DATA, message: 'SUCCESS', status: 0 },
  '/general-checking': { result: GENERAL_CHECKING_MOCK_DATA, message: 'SUCCESS', status: 0 },
};

function createMockAxios(): jest.Mocked<AxiosInstance> {
  return {
    get: jest.fn().mockImplementation((url: string) =>
      Promise.resolve({ data: MOCK_RESPONSES[url] }),
    ),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<AxiosInstance>;
}

describe('EKYCParameterService', () => {
  let mockHttp: jest.Mocked<AxiosInstance>;
  let service: EKYCParameterService;

  beforeEach(() => {
    mockHttp = createMockAxios();
    service = new EKYCParameterService(mockHttp);
  });

  describe('getCustomerTypes()', () => {
    it('should return ApiEkycParameterResponse with customer type options', async () => {
      const result = await service.getCustomerTypes();

      expect(result).toEqual({
        result: CUSTOMER_TYPE_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });

    it('should return array with id, code and name properties', async () => {
      const result = await service.getCustomerTypes();
      result.result.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('name');
      });
    });
  });

  describe('getLegalEntityTypes()', () => {
    it('should return ApiResponse with legal entity type options', async () => {
      const result = await service.getLegalEntityTypes();

      expect(result).toEqual({
        result: LEGAL_ENTITY_TYPE_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });
  });

  describe('getLegalEntityCharacteristics()', () => {
    it('should return ApiResponse with legal entity characteristic options', async () => {
      const result = await service.getLegalEntityCharacteristics();

      expect(result).toEqual({
        result: LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });
  });

  describe('getLineOfBusinessOptions()', () => {
    it('should return ApiResponse with line of business options', async () => {
      const result = await service.getLineOfBusinessOptions();

      expect(result).toEqual({
        result: LINE_OF_BUSINESS_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });
  });

  describe('getCountryOptions()', () => {
    it('should return ApiResponse with country options', async () => {
      const result = await service.getCountryOptions();

      expect(result).toEqual({
        result: COUNTRY_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });
  });

  describe('getGeneralCheckingOptions()', () => {
    it('should return ApiResponse with general checking options', async () => {
      const result = await service.getGeneralCheckingOptions();

      expect(result).toEqual({
        result: GENERAL_CHECKING_MOCK_DATA,
        message: 'SUCCESS',
        status: 0,
      });
    });

    it('should return items with key and label (not id)', async () => {
      const result = await service.getGeneralCheckingOptions();
      result.result.forEach((item) => {
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('label');
      });
    });
  });

  describe('all methods', () => {
    it('should all return status 0 and SUCCESS message', async () => {
      const methods = [
        service.getCustomerTypes(),
        service.getLegalEntityTypes(),
        service.getLegalEntityCharacteristics(),
        service.getLineOfBusinessOptions(),
        service.getCountryOptions(),
        service.getGeneralCheckingOptions(),
      ];

      const results = await Promise.all(methods);
      results.forEach((result) => {
        expect(result.status).toBe(0);
        expect(result.message).toBe('SUCCESS');
      });
    });
  });

  describe('constructor', () => {
    it('should accept custom axios instance', () => {
      const customHttp = createMockAxios();
      const customService = new EKYCParameterService(customHttp);
      expect(customService).toBeInstanceOf(EKYCParameterService);
    });

    it('should default to ekycParameterApiClient when no instance provided', () => {
      const defaultService = new EKYCParameterService();
      expect(defaultService).toBeInstanceOf(EKYCParameterService);
    });
  });
});
