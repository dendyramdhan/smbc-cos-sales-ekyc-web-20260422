import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useOnboarding, onboardingKeys } from '@/hooks/queries/useOnboardingQueries';

const mockGetOnboardingData = jest.fn();

jest.mock('@/services', () => ({
  onboardingService: {
    getOnboardingData: (...args: unknown[]) => mockGetOnboardingData(...args),
  },
}));

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

const MOCK_RESPONSE = {
  data: {
    customerType: '31 - Corporate Japanese',
    capId: 'CAP-2024-001',
    customerName: 'SUZUKI MOTOR CORPORATION',
  },
  message: 'SUCCESS',
  status: 0,
};

describe('useOnboardingQueries', () => {
  beforeEach(() => {
    mockGetOnboardingData.mockReset();
    mockGetOnboardingData.mockResolvedValue(MOCK_RESPONSE);
  });

  describe('onboardingKeys', () => {
    it('should have correct all key', () => {
      expect(onboardingKeys.all).toEqual(['onboarding']);
    });

    it('should generate correct detail key', () => {
      expect(onboardingKeys.detail('abc-123')).toEqual(['onboarding', 'detail', 'abc-123']);
    });

    it('should generate correct lists key', () => {
      expect(onboardingKeys.lists()).toEqual(['onboarding', 'list']);
    });
  });

  describe('useOnboarding', () => {
    it('should fetch onboarding data when id is provided', async () => {
      const { result } = renderHook(() => useOnboarding('test-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.data).toEqual(expect.objectContaining({
        customerName: 'SUZUKI MOTOR CORPORATION',
        capId: 'CAP-2024-001',
      }));
    });

    it('should return SUCCESS status and message', async () => {
      const { result } = renderHook(() => useOnboarding('test-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.status).toBe(0);
      expect(result.current.data?.message).toBe('SUCCESS');
    });

    it('should call service with the provided id', async () => {
      const { result } = renderHook(() => useOnboarding('my-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetOnboardingData).toHaveBeenCalledWith('my-id');
    });

    it('should not fetch when id is empty string', () => {
      const { result } = renderHook(() => useOnboarding(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should be in pending state when id is empty', () => {
      const { result } = renderHook(() => useOnboarding(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.isFetching).toBe(false);
    });
  });
});
