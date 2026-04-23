import { AxiosError, AxiosHeaders } from 'axios';
import { makeQueryClient, getQueryClient } from '@/lib/query/queryClient';

describe('queryClient', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('makeQueryClient', () => {
    it('should return a new QueryClient instance', () => {
      const client = makeQueryClient();

      expect(client).toBeDefined();
      expect(typeof client.getQueryCache).toBe('function');
      expect(typeof client.getMutationCache).toBe('function');
    });

    it('should return different instances on each call', () => {
      const client1 = makeQueryClient();
      const client2 = makeQueryClient();

      expect(client1).not.toBe(client2);
    });

    it('should have correct default staleTime', () => {
      const client = makeQueryClient();

      expect(client.getDefaultOptions().queries?.staleTime).toBe(60_000);
    });

    it('should have correct default gcTime', () => {
      const client = makeQueryClient();

      expect(client.getDefaultOptions().queries?.gcTime).toBe(5 * 60_000);
    });

    it('should have refetchOnWindowFocus disabled', () => {
      const client = makeQueryClient();

      expect(client.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false);
    });

    it('should have mutation retry disabled', () => {
      const client = makeQueryClient();

      expect(client.getDefaultOptions().mutations?.retry).toBe(false);
    });

    it('should not retry on 4xx AxiosError', () => {
      const client = makeQueryClient();
      const retryFn = client.getDefaultOptions().queries?.retry as (
        failureCount: number,
        error: unknown,
      ) => boolean;

      const error = new AxiosError('Bad Request', '400', undefined, undefined, {
        status: 400,
        data: {},
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      expect(retryFn(0, error)).toBe(false);
    });

    it('should not retry on 404 AxiosError', () => {
      const client = makeQueryClient();
      const retryFn = client.getDefaultOptions().queries?.retry as (
        failureCount: number,
        error: unknown,
      ) => boolean;

      const error = new AxiosError('Not Found', '404', undefined, undefined, {
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      expect(retryFn(0, error)).toBe(false);
    });

    it('should retry on 5xx AxiosError up to 2 times', () => {
      const client = makeQueryClient();
      const retryFn = client.getDefaultOptions().queries?.retry as (
        failureCount: number,
        error: unknown,
      ) => boolean;

      const error = new AxiosError('Server Error', '500', undefined, undefined, {
        status: 500,
        data: {},
        statusText: 'Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      expect(retryFn(0, error)).toBe(true);  // 1st retry
      expect(retryFn(1, error)).toBe(true);  // 2nd retry
      expect(retryFn(2, error)).toBe(false); // exceeded
    });

    it('should retry on non-Axios errors up to 2 times', () => {
      const client = makeQueryClient();
      const retryFn = client.getDefaultOptions().queries?.retry as (
        failureCount: number,
        error: unknown,
      ) => boolean;

      const genericError = new Error('Something failed');

      expect(retryFn(0, genericError)).toBe(true);
      expect(retryFn(1, genericError)).toBe(true);
      expect(retryFn(2, genericError)).toBe(false);
    });

    it('should retry AxiosError without response (network error)', () => {
      const client = makeQueryClient();
      const retryFn = client.getDefaultOptions().queries?.retry as (
        failureCount: number,
        error: unknown,
      ) => boolean;

      const error = new AxiosError('Network Error');

      expect(retryFn(0, error)).toBe(true);
      expect(retryFn(1, error)).toBe(true);
      expect(retryFn(2, error)).toBe(false);
    });
  });

  describe('handleGlobalError (via queryCache)', () => {
    it('should log AxiosError with status and message from response', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const client = makeQueryClient();
      const queryCache = client.getQueryCache();

      const error = new AxiosError('fail', '500', undefined, undefined, {
        status: 500,
        data: { message: 'Internal Server Error' },
        statusText: 'Server Error',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      const onError = (queryCache as unknown as { config: { onError: (err: unknown) => void } }).config.onError;
      onError(error);

      expect(consoleSpy).toHaveBeenCalledWith('[API 500]', 'Internal Server Error');
    });

    it('should log AxiosError with fallback message when response data has no message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const client = makeQueryClient();
      const queryCache = client.getQueryCache();

      const error = new AxiosError('Network Error');

      const onError = (queryCache as unknown as { config: { onError: (err: unknown) => void } }).config.onError;
      onError(error);

      expect(consoleSpy).toHaveBeenCalledWith('[API NETWORK]', 'Network Error');
    });

    it('should NOT log non-AxiosError', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const client = makeQueryClient();
      const queryCache = client.getQueryCache();

      const onError = (queryCache as unknown as { config: { onError: (err: unknown) => void } }).config.onError;
      onError(new Error('random'));

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log via mutationCache onError as well', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const client = makeQueryClient();
      const mutationCache = client.getMutationCache();

      const error = new AxiosError('Mutation fail', '422', undefined, undefined, {
        status: 422,
        data: { message: 'Validation Error' },
        statusText: 'Unprocessable Entity',
        headers: {},
        config: { headers: new AxiosHeaders() },
      });

      const onError = (mutationCache as unknown as { config: { onError: (err: unknown) => void } }).config.onError;
      onError(error);

      expect(consoleSpy).toHaveBeenCalledWith('[API 422]', 'Validation Error');
    });
  });

  describe('getQueryClient', () => {
    it('should return a query client object in browser environment', () => {
      const client = getQueryClient();

      expect(client).toBeDefined();
      expect(typeof client.getQueryCache).toBe('function');
    });

    it('should return the same instance on repeated calls (browser singleton)', () => {
      const client1 = getQueryClient();
      const client2 = getQueryClient();

      expect(client1).toBe(client2);
    });

    it('should return a new instance in server environment', () => {
      // Reset module to clear singleton, then test server path
      jest.resetModules();

      const originalWindow = globalThis.window;
      // @ts-expect-error - setting window to undefined to simulate server
      delete globalThis.window;

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getQueryClient: serverGetQueryClient } = require('@/lib/query/queryClient');

      const client1 = serverGetQueryClient();
      const client2 = serverGetQueryClient();

      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
      expect(client1).not.toBe(client2);

      // Restore
      globalThis.window = originalWindow;
    });
  });
});
