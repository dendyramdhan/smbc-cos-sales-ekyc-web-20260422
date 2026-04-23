export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
  MS_ONBOARDING_API_URL: process.env.NEXT_PUBLIC_MS_ONBOARDING_API_URL ?? '/api/onboarding',
  MS_EKYC_PARAMETER_API_URL: process.env.NEXT_PUBLIC_MS_EKYC_PARAMETER_API_URL ?? '/api/ekyc-param',
  TIMEOUT: 15_000,
} as const;
