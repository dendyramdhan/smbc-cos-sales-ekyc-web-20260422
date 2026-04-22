import type { AxiosInstance } from 'axios';
import { BaseApiService } from './api.service';
import { ekycParameterApiClient } from '@/lib/axios/instances';
import type { ApiEkycParameterResponse } from '@/lib/query';
import type {
  CountryParameter,
  CustomerTypeParameter,
  GeneralCheckingParameter,
  LegalEntityCharacteristicParameter,
  LegalEntityTypeParameter,
  LineOfBusinessParameter,
} from '@/types/onboarding';

export class EKYCParameterService extends BaseApiService {
  constructor(http: AxiosInstance = ekycParameterApiClient) {
    super(http);
  }

  async getCustomerTypes(): Promise<ApiEkycParameterResponse<Array<CustomerTypeParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<CustomerTypeParameter>>>('/customer-types');
  }

  async getLegalEntityTypes(): Promise<ApiEkycParameterResponse<Array<LegalEntityTypeParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<LegalEntityTypeParameter>>>('/legal-entity-types');
  }

  async getLegalEntityCharacteristics(): Promise<ApiEkycParameterResponse<Array<LegalEntityCharacteristicParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<LegalEntityCharacteristicParameter>>>('/legal-entity-characteristics');
  }

  async getLineOfBusinessOptions(): Promise<ApiEkycParameterResponse<Array<LineOfBusinessParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<LineOfBusinessParameter>>>('/line-of-business');
  }

  async getCountryOptions(): Promise<ApiEkycParameterResponse<Array<CountryParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<CountryParameter>>>('/countries');
  }

  async getGeneralCheckingOptions(): Promise<ApiEkycParameterResponse<Array<GeneralCheckingParameter>>> {
    return this.get<ApiEkycParameterResponse<Array<GeneralCheckingParameter>>>('/general-checking');
  }
};

export const ekycParameterService = new EKYCParameterService();