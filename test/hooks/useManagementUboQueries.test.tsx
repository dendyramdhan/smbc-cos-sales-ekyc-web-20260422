import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useManagementUboMembers,
  useSaveManagementUboMembers,
  useDeleteManagementUboMember,
  managementUboKeys,
} from '@/hooks/queries/useManagementUboQueries';
import type { ManagementUboMember } from '@/types/onboarding';

const mockGetMembers = jest.fn();
const mockSaveMembers = jest.fn();
const mockDeleteMember = jest.fn();

jest.mock('@/services', () => ({
  managementUboService: {
    getMembers: (...args: unknown[]) => mockGetMembers(...args),
    saveMembers: (...args: unknown[]) => mockSaveMembers(...args),
    deleteMember: (...args: unknown[]) => mockDeleteMember(...args),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const MOCK_MEMBERS: ManagementUboMember[] = [
  { id: 1, positionType: 'Director', name: 'Jane', groupType: 'INDIVIDUAL', authorizedSigner: true },
];
const MOCK_RESPONSE = { result: MOCK_MEMBERS, message: 'SUCCESS', status: 200 };

describe('useManagementUboQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('managementUboKeys', () => {
    it('should have correct all key', () => {
      expect(managementUboKeys.all).toEqual(['managementUbo']);
    });

    it('should generate correct detail key', () => {
      expect(managementUboKeys.detail('REF-001')).toEqual(['managementUbo', 'detail', 'REF-001']);
    });
  });

  describe('useManagementUboMembers', () => {
    it('should be disabled when referenceId is empty', () => {
      const { result } = renderHook(() => useManagementUboMembers(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch members when referenceId is provided', async () => {
      mockGetMembers.mockResolvedValue(MOCK_RESPONSE);

      const { result } = renderHook(() => useManagementUboMembers('REF-001'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.result).toEqual(MOCK_MEMBERS);
      expect(mockGetMembers).toHaveBeenCalledWith('REF-001');
    });

    it('should call service with the provided referenceId', async () => {
      mockGetMembers.mockResolvedValue(MOCK_RESPONSE);

      const { result } = renderHook(() => useManagementUboMembers('REF-XYZ'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetMembers).toHaveBeenCalledWith('REF-XYZ');
    });
  });

  describe('useSaveManagementUboMembers', () => {
    it('should call saveMembers with members array', async () => {
      mockSaveMembers.mockResolvedValue(MOCK_RESPONSE);
      mockGetMembers.mockResolvedValue(MOCK_RESPONSE);

      const { result } = renderHook(() => useSaveManagementUboMembers('REF-001'), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync(MOCK_MEMBERS);
      });

      expect(mockSaveMembers).toHaveBeenCalledWith('REF-001', MOCK_MEMBERS);
    });

    it('should succeed and return response', async () => {
      mockSaveMembers.mockResolvedValue(MOCK_RESPONSE);
      mockGetMembers.mockResolvedValue(MOCK_RESPONSE);

      const { result } = renderHook(() => useSaveManagementUboMembers('REF-002'), {
        wrapper: createWrapper(),
      });

      let response;
      await act(async () => {
        response = await result.current.mutateAsync([]);
      });

      expect(response).toEqual(MOCK_RESPONSE);
    });
  });

  describe('useDeleteManagementUboMember', () => {
    it('should call deleteMember with the member id', async () => {
      mockDeleteMember.mockResolvedValue({ result: null, message: 'SUCCESS', status: 200 });
      mockGetMembers.mockResolvedValue(MOCK_RESPONSE);

      const { result } = renderHook(() => useDeleteManagementUboMember('REF-001'), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync(42);
      });

      expect(mockDeleteMember).toHaveBeenCalledWith(42);
    });
  });
});
