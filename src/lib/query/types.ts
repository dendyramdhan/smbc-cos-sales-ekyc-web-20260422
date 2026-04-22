// ─── Standard API Response Contracts ─────────────────────────────────────────
// Sesuaikan interface ini dengan contract backend.

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiEkycParameterResponse<T> {
  result: T;
  message: string;
  status: number;
}