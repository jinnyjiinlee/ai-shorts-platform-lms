// Auth types
export * from './auth.types';

// User types
export * from './user.types';

// Mission types
export * from './mission.types';

// Dashboard types
export * from './dashboard.types';

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