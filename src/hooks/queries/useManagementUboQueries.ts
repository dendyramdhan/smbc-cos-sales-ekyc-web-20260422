import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQueryKeys } from '@/lib/query';
import { managementUboService } from '@/services';
import type { ManagementUboMember } from '@/types/onboarding';

const baseManagementUboKeys = createQueryKeys('managementUbo');

export const managementUboKeys = {
  ...baseManagementUboKeys,
};

export const useManagementUboMembers = (referenceId: string) =>
  useQuery({
    queryKey: managementUboKeys.detail(referenceId),
    queryFn: () => managementUboService.getMembers(referenceId),
    enabled: !!referenceId,
  });

export const useSaveManagementUboMembers = (referenceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (members: ManagementUboMember[]) =>
      managementUboService.saveMembers(referenceId, members),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementUboKeys.detail(referenceId) });
    },
  });
};

export const useDeleteManagementUboMember = (referenceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => managementUboService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementUboKeys.detail(referenceId) });
    },
  });
};
