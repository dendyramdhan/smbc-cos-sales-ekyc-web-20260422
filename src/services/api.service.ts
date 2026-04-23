import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { apiClient } from '@/lib/axios';

/**
 * Base class untuk semua API service.
 * Setiap domain (user, order, dsb.) extend class ini.
 *
 * Otomatis meng-unwrap `response.data` sehingga consumer langsung
 * dapat body JSON tanpa harus `.then(r => r.data)` berulang-ulang.
 *
 * @example
 * ```ts
 * class UserService extends BaseApiService {
 *   getUsers(params?: GetUsersParams) {
 *     return this.get<ApiResponse<User[]>>('/users', { params });
 *   }
 *
 *   getUserById(id: string) {
 *     return this.get<ApiResponse<User>>(`/users/${id}`);
 *   }
 *
 *   createUser(payload: CreateUserPayload) {
 *     return this.post<ApiResponse<User>>('/users', payload);
 *   }
 *
 *   updateUser(id: string, payload: UpdateUserPayload) {
 *     return this.put<ApiResponse<User>>(`/users/${id}`, payload);
 *   }
 *
 *   deleteUser(id: string) {
 *     return this.delete<ApiResponse<void>>(`/users/${id}`);
 *   }
 * }
 *
 * export const userService = new UserService();
 * ```
 */
export abstract class BaseApiService {
  constructor(protected readonly http: AxiosInstance = apiClient) {}

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.put<T>(url, data, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }
}
