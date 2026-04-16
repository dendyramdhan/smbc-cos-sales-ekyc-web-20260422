import axios, { type AxiosInstance } from 'axios';
import { type AxiosInstanceConfig } from './types';
import { API_CONFIG } from '@/constants/apiConfig';

export const createAxiosInstance = (config: AxiosInstanceConfig = {}): AxiosInstance => {
  const { label, withAuth, withLogging, ...axiosConfig } = config;
  void label;
  void withAuth;
  void withLogging;

  return axios.create({
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
    ...axiosConfig
  });
};
