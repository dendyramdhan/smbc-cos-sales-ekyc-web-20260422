import {
  QueryClient,
  QueryCache,
  MutationCache,
  type DefaultOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

// ─── Global Error Handler ────────────────────────────────────────────────────

function handleGlobalError(error: unknown): void {
  if (!(error instanceof AxiosError)) return;

  const status = error.response?.status;
  const message =
    (error.response?.data as { message?: string })?.message ?? error.message;

  // Central logging — bisa diganti toast/notification nanti
  console.error(`[API ${status ?? 'NETWORK'}]`, message);
}

// ─── Default Options ─────────────────────────────────────────────────────────

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,       // 1 menit  — data dianggap masih fresh
    gcTime: 5 * 60 * 1000,      // 5 menit  — cache di-garbage-collect
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Jangan retry untuk client errors (4xx)
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 2;
    },
  },
  mutations: {
    retry: false,
  },
};

// ─── Factory ─────────────────────────────────────────────────────────────────

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalError }),
    mutationCache: new MutationCache({ onError: handleGlobalError }),
    defaultOptions,
  });
}

// ─── Singleton (Browser) / Fresh (Server) ────────────────────────────────────
// Pattern resmi dari TanStack untuk Next.js App Router + React 19.
// Di server selalu buat baru; di browser reuse agar cache persistent.

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
