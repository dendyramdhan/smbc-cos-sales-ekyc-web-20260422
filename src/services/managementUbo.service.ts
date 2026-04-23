import type { AxiosInstance } from 'axios';
import { BaseApiService } from './api.service';
import { onboardingApiClient } from '@/lib/axios/instances';
import type { ApiEkycParameterResponse } from '@/lib/query';
import type { ManagementUboMember } from '@/types/onboarding';

export class ManagementUboService extends BaseApiService {
  constructor(http: AxiosInstance = onboardingApiClient) {
    super(http);
  }

  async getMembers(referenceId: string): Promise<ApiEkycParameterResponse<ManagementUboMember[]>> {
    return this.get<ApiEkycParameterResponse<ManagementUboMember[]>>(`/management-ubo/${referenceId}`);
  }

  async saveMembers(
    referenceId: string,
    members: ManagementUboMember[],
  ): Promise<ApiEkycParameterResponse<ManagementUboMember[]>> {
    return this.put<ApiEkycParameterResponse<ManagementUboMember[]>>(
      `/management-ubo/${referenceId}`,
      { members },
    );
  }

  async deleteMember(id: number): Promise<ApiEkycParameterResponse<void>> {
    return this.delete<ApiEkycParameterResponse<void>>(`/management-ubo/members/${id}`);
  }
}

export const managementUboService = new ManagementUboService();
