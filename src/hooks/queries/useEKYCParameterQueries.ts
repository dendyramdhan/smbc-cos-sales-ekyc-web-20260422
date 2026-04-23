import { createQueryKeys } from '@/lib/query';
import { ekycParameterService } from '@/services';
import { useQuery, useQueries } from '@tanstack/react-query';

const baseEkycParameterKeys = createQueryKeys('ekycParameter');

export const ekycParameterKeys = {
  ...baseEkycParameterKeys,
};

export const useCustomerTypeOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('customerTypes'),
    queryFn: () => ekycParameterService.getCustomerTypes(),
  });

export const useLegalEntityTypeOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('legalEntityTypes'),
    queryFn: () => ekycParameterService.getLegalEntityTypes(),
  });

export const useLegalEntityCharacteristicOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('legalEntityCharacteristics'),
    queryFn: () => ekycParameterService.getLegalEntityCharacteristics(),
  });

export const useLineOfBusinessOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('lineOfBusinessOptions'),
    queryFn: () => ekycParameterService.getLineOfBusinessOptions(),
  });

export const useCountryOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('countryOptions'),
    queryFn: () => ekycParameterService.getCountryOptions(),
  });

export const useGeneralCheckingOptions = () =>
  useQuery({
    queryKey: ekycParameterKeys.list('generalCheckingOptions'),
    queryFn: () => ekycParameterService.getGeneralCheckingOptions(),
  });


// ─── Combined Queries ───────────────────────────────────────────────────

export const useCustomerInfoOptions = () =>
  useQueries({
    queries: [
      { queryKey: ekycParameterKeys.list('customerTypes'),              queryFn: () => ekycParameterService.getCustomerTypes() },
      { queryKey: ekycParameterKeys.list('legalEntityTypes'),           queryFn: () => ekycParameterService.getLegalEntityTypes() },
      { queryKey: ekycParameterKeys.list('legalEntityCharacteristics'), queryFn: () => ekycParameterService.getLegalEntityCharacteristics() },
      { queryKey: ekycParameterKeys.list('lineOfBusinessOptions'),      queryFn: () => ekycParameterService.getLineOfBusinessOptions() },
      { queryKey: ekycParameterKeys.list('countryOptions'),             queryFn: () => ekycParameterService.getCountryOptions() },
      { queryKey: ekycParameterKeys.list('generalCheckingOptions'),     queryFn: () => ekycParameterService.getGeneralCheckingOptions() },
    ],
    combine: (results) => ({
      customerTypeOptions:              results[0].data?.result ?? [],
      legalEntityTypeOptions:           results[1].data?.result ?? [],
      legalEntityCharacteristicOptions: results[2].data?.result ?? [],
      lineOfBusinessOptions:            results[3].data?.result ?? [],
      countryOptions:                   results[4].data?.result ?? [],
      generalCheckingOptions:           results[5].data?.result ?? [],
      isLoading: results.some((r) => r.isLoading),
    }),
  });