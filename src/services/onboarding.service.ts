import { onboardingApiClient } from '@/lib/axios';
import { BaseApiService } from './api.service';
import { CUSTOMER_INFO_MOCK_DATA } from './__mocks__/customerInfo.onboarding';
import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '@/lib/query';
import type { OnboardingData } from '@/types/onboarding';


export class OnboardingService extends BaseApiService {
  constructor(http: AxiosInstance = onboardingApiClient) {
    super(http);
  }

  async getOnboardingData(id: string): Promise<ApiResponse<OnboardingData>> {
    void id; // To avoid unused variable error since we're returning mock data
    return Promise.resolve({
      data: {
        ...CUSTOMER_INFO_MOCK_DATA,
      },
      message: 'SUCCESS',
      status: 0,
    });
  }
}

export const onboardingService = new OnboardingService();