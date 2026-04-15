import axios, { type AxiosInstance } from 'axios';
import { type AxiosInstanceConfig } from './types';

export const createAxiosInstance = (config: AxiosInstanceConfig = {}): AxiosInstance => {
  const { label, withAuth, withLogging, ...axiosConfig } = config;
  void label;
  void withAuth;
  void withLogging;

  return axios.create({
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
    ...axiosConfig
  });
};
