import {
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { createQueryKeys, type ApiResponse } from '@/lib/query';
import { onboardingService } from '@/services';
import type {
  OnboardingData,
} from '@/types/onboarding';

const baseOnboardingKeys = createQueryKeys('onboarding');

export const onboardingKeys = {
  ...baseOnboardingKeys
};

export const useOnboarding = (
  id: string,
  options?: Partial<UseQueryOptions<ApiResponse<OnboardingData>>>,
) =>
  useQuery({
    queryKey: onboardingKeys.detail(id),
    queryFn: () => onboardingService.getOnboardingData(id),
    enabled: !!id,
    ...options,
  });