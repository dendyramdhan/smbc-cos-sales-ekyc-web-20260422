import type { AxiosInstance } from 'axios';
import { BaseApiService } from '@/services/api.service';

// Concrete test subclass to expose protected methods
class TestService extends BaseApiService {
  constructor(http: AxiosInstance) {
    super(http);
  }

  public testGet<T>(url: string, config?: Parameters<BaseApiService['get']>[1]) {
    return this.get<T>(url, config);
  }
  public testPost<T>(url: string, data?: unknown, config?: Parameters<BaseApiService['post']>[2]) {
    return this.post<T>(url, data, config);
  }
  public testPut<T>(url: string, data?: unknown, config?: Parameters<BaseApiService['put']>[2]) {
    return this.put<T>(url, data, config);
  }
  public testPatch<T>(url: string, data?: unknown, config?: Parameters<BaseApiService['patch']>[2]) {
    return this.patch<T>(url, data, config);
  }
  public testDelete<T>(url: string, config?: Parameters<BaseApiService['delete']>[1]) {
    return this.delete<T>(url, config);
  }
}

function createMockAxios(): jest.Mocked<AxiosInstance> {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<AxiosInstance>;
}

describe('BaseApiService', () => {
  let mockHttp: jest.Mocked<AxiosInstance>;
  let service: TestService;

  beforeEach(() => {
    mockHttp = createMockAxios();
    service = new TestService(mockHttp);
  });

  describe('get()', () => {
    it('should call http.get and unwrap response.data', async () => {
      const body = { id: 1, name: 'Alice' };
      mockHttp.get.mockResolvedValue({ data: body, status: 200 });

      const result = await service.testGet('/users/1');

      expect(mockHttp.get).toHaveBeenCalledWith('/users/1', undefined);
      expect(result).toEqual(body);
    });

    it('should forward config to http.get', async () => {
      mockHttp.get.mockResolvedValue({ data: [], status: 200 });
      const config = { params: { page: 1 } };

      await service.testGet('/users', config);

      expect(mockHttp.get).toHaveBeenCalledWith('/users', config);
    });

    it('should propagate errors', async () => {
      const error = new Error('Network Error');
      mockHttp.get.mockRejectedValue(error);

      await expect(service.testGet('/fail')).rejects.toThrow('Network Error');
    });
  });

  describe('post()', () => {
    it('should call http.post and unwrap response.data', async () => {
      const body = { id: 2, name: 'Bob' };
      mockHttp.post.mockResolvedValue({ data: body, status: 201 });

      const result = await service.testPost('/users', { name: 'Bob' });

      expect(mockHttp.post).toHaveBeenCalledWith('/users', { name: 'Bob' }, undefined);
      expect(result).toEqual(body);
    });

    it('should forward config to http.post', async () => {
      mockHttp.post.mockResolvedValue({ data: {}, status: 201 });
      const config = { headers: { 'X-Custom': 'value' } };

      await service.testPost('/users', { name: 'Bob' }, config);

      expect(mockHttp.post).toHaveBeenCalledWith('/users', { name: 'Bob' }, config);
    });
  });

  describe('put()', () => {
    it('should call http.put and unwrap response.data', async () => {
      const body = { id: 1, name: 'Updated' };
      mockHttp.put.mockResolvedValue({ data: body, status: 200 });

      const result = await service.testPut('/users/1', { name: 'Updated' });

      expect(mockHttp.put).toHaveBeenCalledWith('/users/1', { name: 'Updated' }, undefined);
      expect(result).toEqual(body);
    });
  });

  describe('patch()', () => {
    it('should call http.patch and unwrap response.data', async () => {
      const body = { id: 1, name: 'Patched' };
      mockHttp.patch.mockResolvedValue({ data: body, status: 200 });

      const result = await service.testPatch('/users/1', { name: 'Patched' });

      expect(mockHttp.patch).toHaveBeenCalledWith('/users/1', { name: 'Patched' }, undefined);
      expect(result).toEqual(body);
    });
  });

  describe('delete()', () => {
    it('should call http.delete and unwrap response.data', async () => {
      mockHttp.delete.mockResolvedValue({ data: null, status: 204 });

      const result = await service.testDelete('/users/1');

      expect(mockHttp.delete).toHaveBeenCalledWith('/users/1', undefined);
      expect(result).toBeNull();
    });

    it('should forward config to http.delete', async () => {
      mockHttp.delete.mockResolvedValue({ data: null, status: 204 });
      const config = { params: { force: true } };

      await service.testDelete('/users/1', config);

      expect(mockHttp.delete).toHaveBeenCalledWith('/users/1', config);
    });
  });
});
