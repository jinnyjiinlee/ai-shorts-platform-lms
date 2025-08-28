// 🎯 기존 호환성을 위한 Re-export
// 새로운 통합 타입 구조로 리다이렉트
export * from '@/types';

// Common types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  cohort?: number;
  dateFrom?: string;
  dateTo?: string;
}