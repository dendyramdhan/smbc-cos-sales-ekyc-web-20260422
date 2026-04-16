export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
  TIMEOUT: 15_000,
} as const;
