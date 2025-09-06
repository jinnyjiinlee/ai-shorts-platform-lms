import { AdminUserView } from '@/types/domains/user';

// 🎯 사용자 관리 관련 타입 정의

export interface UserManagementState {
  users: AdminUserView[];
  isLoading: boolean;
  activeTab: 'students' | 'admins';
  statusFilter: string;
  selectedUserIds: string[];
  selectedAllUser: boolean;
  currentPage: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface StatusCounts {
  all: number;
  approved: number;
  pending: number;
  rejected: number;
  unknown: number;
}

export interface SortableHeaderProps {
  column: string;
  children: React.ReactNode;
  className?: string;
}

export interface FilterTagProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

// Re-export from domain types
export type { AdminUserView } from '@/types/domains/user';