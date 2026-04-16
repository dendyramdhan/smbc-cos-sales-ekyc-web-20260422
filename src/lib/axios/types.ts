import { type AxiosRequestConfig } from 'axios';

export interface AxiosInstanceConfig extends AxiosRequestConfig {
  label?: string;
  withAuth?: boolean;
  withLogging?: boolean;
}