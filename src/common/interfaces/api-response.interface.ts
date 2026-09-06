export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  path?: string;
  statusCode?: number;
  errors?: string[];
  meta?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}