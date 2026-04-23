import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useCustomerTypeOptions,
  useLegalEntityTypeOptions,
  useLegalEntityCharacteristicOptions,
  useLineOfBusinessOptions,
  useCountryOptions,
  useGeneralCheckingOptions,
  useCustomerInfoOptions,
  ekycParameterKeys,
} from '@/hooks/queries/useEKYCParameterQueries';

// ─── Mock Functions ──────────────────────────────────────────────────────────

const mockGetCustomerTypes = jest.fn();
const mockGetLegalEntityTypes = jest.fn();
const mockGetLegalEntityCharacteristics = jest.fn();
const mockGetLineOfBusinessOptions = jest.fn();
const mockGetCountryOptions = jest.fn();
const mockGetGeneralCheckingOptions = jest.fn();

jest.mock('@/services/ekycParameter.service', () => ({
  ekycParameterService: {
    getCustomerTypes: (...args: unknown[]) => mockGetCustomerTypes(...args),
    getLegalEntityTypes: (...args: unknown[]) => mockGetLegalEntityTypes(...args),
    getLegalEntityCharacteristics: (...args: unknown[]) => mockGetLegalEntityCharacteristics(...args),
    getLineOfBusinessOptions: (...args: unknown[]) => mockGetLineOfBusinessOptions(...args),
    getCountryOptions: (...args: unknown[]) => mockGetCountryOptions(...args),
    getGeneralCheckingOptions: (...args: unknown[]) => mockGetGeneralCheckingOptions(...args),
  },
}));

// ─── Test Data ───────────────────────────────────────────────────────────────

const MOCK_CUSTOMER_TYPES = [
  { id: 1, label: '31 - Corporate Japanese' },
  { id: 2, label: '32 - Corporate Non-Japanese' },
];

const MOCK_LEGAL_ENTITY_TYPES = [
  { id: 1, label: 'Joint Stock Company' },
  { id: 2, label: 'Limited Liability Company' },
];

const MOCK_LEGAL_ENTITY_CHARS = [
  { id: 1, label: 'Publicly Listed' },
];

const MOCK_LOB = [
  { id: 1, label: 'Automotive Manufacturing' },
];

const MOCK_COUNTRIES = [
  { id: 1, label: 'Japan' },
];

const MOCK_GENERAL_CHECKING = [
  { key: 'a', label: 'Option A' },
  { key: 'f', label: 'None of the above' },
];

const makeResponse = (data: unknown) => ({
  result: data,
  message: 'SUCCESS',
  status: 0,
});

// ─── Wrapper ─────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useEKYCParameterQueries', () => {
  beforeEach(() => {
    mockGetCustomerTypes.mockReset().mockResolvedValue(makeResponse(MOCK_CUSTOMER_TYPES));
    mockGetLegalEntityTypes.mockReset().mockResolvedValue(makeResponse(MOCK_LEGAL_ENTITY_TYPES));
    mockGetLegalEntityCharacteristics.mockReset().mockResolvedValue(makeResponse(MOCK_LEGAL_ENTITY_CHARS));
    mockGetLineOfBusinessOptions.mockReset().mockResolvedValue(makeResponse(MOCK_LOB));
    mockGetCountryOptions.mockReset().mockResolvedValue(makeResponse(MOCK_COUNTRIES));
    mockGetGeneralCheckingOptions.mockReset().mockResolvedValue(makeResponse(MOCK_GENERAL_CHECKING));
  });

  describe('ekycParameterKeys', () => {
    it('should have correct all key', () => {
      expect(ekycParameterKeys.all).toEqual(['ekycParameter']);
    });

    it('should generate correct list key', () => {
      expect(ekycParameterKeys.list('customerTypes')).toEqual([
        'ekycParameter',
        'list',
        'customerTypes',
      ]);
    });
  });

  describe('useCustomerTypeOptions', () => {
    it('should fetch customer type options', async () => {
      const { result } = renderHook(() => useCustomerTypeOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_CUSTOMER_TYPES);
    });
  });

  describe('useLegalEntityTypeOptions', () => {
    it('should fetch legal entity type options', async () => {
      const { result } = renderHook(() => useLegalEntityTypeOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_LEGAL_ENTITY_TYPES);
    });
  });

  describe('useLegalEntityCharacteristicOptions', () => {
    it('should fetch legal entity characteristic options', async () => {
      const { result } = renderHook(() => useLegalEntityCharacteristicOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_LEGAL_ENTITY_CHARS);
    });
  });

  describe('useLineOfBusinessOptions', () => {
    it('should fetch line of business options', async () => {
      const { result } = renderHook(() => useLineOfBusinessOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_LOB);
    });
  });

  describe('useCountryOptions', () => {
    it('should fetch country options', async () => {
      const { result } = renderHook(() => useCountryOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_COUNTRIES);
    });
  });

  describe('useGeneralCheckingOptions', () => {
    it('should fetch general checking options', async () => {
      const { result } = renderHook(() => useGeneralCheckingOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_GENERAL_CHECKING);
    });
  });

  describe('useCustomerInfoOptions (combined)', () => {
    it('should combine all 6 queries into a single object', async () => {
      const { result } = renderHook(() => useCustomerInfoOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.customerTypeOptions).toEqual(MOCK_CUSTOMER_TYPES);
      expect(result.current.legalEntityTypeOptions).toEqual(MOCK_LEGAL_ENTITY_TYPES);
      expect(result.current.legalEntityCharacteristicOptions).toEqual(MOCK_LEGAL_ENTITY_CHARS);
      expect(result.current.lineOfBusinessOptions).toEqual(MOCK_LOB);
      expect(result.current.countryOptions).toEqual(MOCK_COUNTRIES);
      expect(result.current.generalCheckingOptions).toEqual(MOCK_GENERAL_CHECKING);
    });

    it('should have isLoading false when all queries succeed', async () => {
      const { result } = renderHook(() => useCustomerInfoOptions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('should initially have isLoading true', () => {
      const { result } = renderHook(() => useCustomerInfoOptions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });
});
