// 🎯 통합 User 도메인 타입 정의
// 모든 User/Student 관련 타입을 여기서 중앙 관리

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatar_url?: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  cohort: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  nickname: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  cohort: number;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  phone?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  skills?: string[];
  interests?: string[];
  created_at: string;
  updated_at: string;
}

// 관리자용 사용자 관리에서 사용하는 확장 타입
export interface AdminUserView extends Omit<User, 'cohort'> {
  user_id: string;
  cohort: string;
}

export interface UserStats {
  totalMissions: number;
  completedMissions: number;
  pendingSubmissions: number;
  totalPoints: number;
  rank?: number;
  completionRate: number;
}

// 🎯 사용자 관련 공통 타입들
export type UserRole = 'admin' | 'student';
export type UserStatus = 'pending' | 'approved' | 'rejected';