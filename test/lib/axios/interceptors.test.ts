import axios, { AxiosError, AxiosHeaders } from 'axios';
import { setupInterceptors } from '@/lib/axios/interceptors';

describe('interceptors', () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('setupInterceptors', () => {
    it('should register request and response interceptors', () => {
      const instance = axios.create();
      const reqUseSpy = jest.spyOn(instance.interceptors.request, 'use');
      const resUseSpy = jest.spyOn(instance.interceptors.response, 'use');

      const result = setupInterceptors(instance);

      expect(reqUseSpy).toHaveBeenCalledTimes(1);
      expect(resUseSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(instance);
    });
  });

  describe('request interceptor', () => {
    it('should attach Authorization header when access_token exists', async () => {
      localStorage.setItem('access_token', 'test-token-123');

      const instance = setupInterceptors(axios.create({ baseURL: 'http://localhost' }));

      // Extract the request interceptor handler
      const reqHandler = (instance.interceptors.request as unknown as { handlers: { fulfilled: (config: unknown) => unknown }[] }).handlers[0].fulfilled;
      const config = { headers: new AxiosHeaders() };
      const result = reqHandler(config) as { headers: AxiosHeaders };

      expect(result.headers.get('Authorization')).toBe('Bearer test-token-123');
    });

    it('should NOT attach Authorization header when no token exists', async () => {
      const instance = setupInterceptors(axios.create({ baseURL: 'http://localhost' }));

      const reqHandler = (instance.interceptors.request as unknown as { handlers: { fulfilled: (config: unknown) => unknown }[] }).handlers[0].fulfilled;
      const config = { headers: new AxiosHeaders() };
      const result = reqHandler(config) as { headers: AxiosHeaders };

      expect(result.headers.has('Authorization')).toBe(false);
    });

    it('should reject on request error', async () => {
      const instance = setupInterceptors(axios.create());

      const reqErrorHandler = (instance.interceptors.request as unknown as { handlers: { rejected: (error: unknown) => Promise<never> }[] }).handlers[0].rejected;
      const error = new AxiosError('request failed');

      await expect(reqErrorHandler(error)).rejects.toBe(error);
    });
  });

  describe('response interceptor', () => {
    it('should pass through successful responses', () => {
      const instance = setupInterceptors(axios.create());

      const resHandler = (instance.interceptors.response as unknown as { handlers: { fulfilled: (response: unknown) => unknown }[] }).handlers[0].fulfilled;
      const mockResponse = { data: { id: 1 }, status: 200 };
      const result = resHandler(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should dispatch auth:unauthorized event on 401 response', async () => {
      const instance = setupInterceptors(axios.create());
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      const resErrorHandler = (instance.interceptors.response as unknown as { handlers: { rejected: (error: unknown) => Promise<never> }[] }).handlers[0].rejected;
      const error = new AxiosError('Unauthorized', '401', undefined, undefined, {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      await expect(resErrorHandler(error)).rejects.toBe(error);
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'auth:unauthorized' })
      );
    });

    it('should NOT dispatch event on non-401 errors', async () => {
      const instance = setupInterceptors(axios.create());
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      const resErrorHandler = (instance.interceptors.response as unknown as { handlers: { rejected: (error: unknown) => Promise<never> }[] }).handlers[0].rejected;
      const error = new AxiosError('Server Error', '500', undefined, undefined, {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      await expect(resErrorHandler(error)).rejects.toBe(error);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should reject on response error without response (network error)', async () => {
      const instance = setupInterceptors(axios.create());
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      const resErrorHandler = (instance.interceptors.response as unknown as { handlers: { rejected: (error: unknown) => Promise<never> }[] }).handlers[0].rejected;
      const error = new AxiosError('Network Error');

      await expect(resErrorHandler(error)).rejects.toBe(error);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
