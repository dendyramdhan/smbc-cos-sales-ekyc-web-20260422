import type { AxiosInstance } from 'axios';
import { ManagementUboService } from '@/services/managementUbo.service';
import type { ManagementUboMember } from '@/types/onboarding';

function createMockAxios(): jest.Mocked<AxiosInstance> {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<AxiosInstance>;
}

const MOCK_MEMBERS: ManagementUboMember[] = [
  {
    id: 1,
    positionType: 'Director',
    name: 'John Doe',
    groupType: 'INDIVIDUAL',
    authorizedSigner: true,
    dateOfBirth: '1985-06-15',
    nikPassportNo: '1234567890',
    countryOfResidence: 'Indonesia',
    address: 'Jl. Test No. 1',
  },
];

const MOCK_RESPONSE = {
  result: MOCK_MEMBERS,
  message: 'SUCCESS',
  status: 200,
};

describe('ManagementUboService', () => {
  let mockHttp: jest.Mocked<AxiosInstance>;
  let service: ManagementUboService;

  beforeEach(() => {
    mockHttp = createMockAxios();
    service = new ManagementUboService(mockHttp);
  });

  describe('constructor', () => {
    it('should create instance with custom axios', () => {
      expect(service).toBeInstanceOf(ManagementUboService);
    });

    it('should default to onboardingApiClient when no instance provided', () => {
      const defaultService = new ManagementUboService();
      expect(defaultService).toBeInstanceOf(ManagementUboService);
    });
  });

  describe('getMembers()', () => {
    it('should call GET /management-ubo/{referenceId}', async () => {
      mockHttp.get.mockResolvedValue({ data: MOCK_RESPONSE });

      const result = await service.getMembers('REF-001');

      expect(mockHttp.get).toHaveBeenCalledWith('/management-ubo/REF-001', undefined);
      expect(result.result).toEqual(MOCK_MEMBERS);
    });

    it('should reject when request fails', async () => {
      const error = new Error('Network error');
      mockHttp.get.mockRejectedValue(error);

      await expect(service.getMembers('REF-BAD')).rejects.toThrow('Network error');
    });
  });

  describe('saveMembers()', () => {
    it('should call PUT /management-ubo/{referenceId} with members in body', async () => {
      mockHttp.put.mockResolvedValue({ data: MOCK_RESPONSE });

      const result = await service.saveMembers('REF-002', MOCK_MEMBERS);

      expect(mockHttp.put).toHaveBeenCalledWith(
        '/management-ubo/REF-002',
        { members: MOCK_MEMBERS },
        undefined,
      );
      expect(result.result).toEqual(MOCK_MEMBERS);
    });

    it('should reject when request fails', async () => {
      mockHttp.put.mockRejectedValue(new Error('Server error'));

      await expect(service.saveMembers('REF-002', MOCK_MEMBERS)).rejects.toThrow('Server error');
    });
  });

  describe('deleteMember()', () => {
    it('should call DELETE /management-ubo/members/{id}', async () => {
      mockHttp.delete.mockResolvedValue({ data: { result: null, message: 'SUCCESS', status: 200 } });

      await service.deleteMember(42);

      expect(mockHttp.delete).toHaveBeenCalledWith('/management-ubo/members/42', undefined);
    });

    it('should reject when request fails', async () => {
      mockHttp.delete.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteMember(99)).rejects.toThrow('Not found');
    });
  });
});
