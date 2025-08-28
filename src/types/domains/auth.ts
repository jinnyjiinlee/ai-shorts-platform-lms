// 🎯 통합 Auth 도메인 타입 정의
// 모든 인증 관련 타입을 여기서 중앙 관리

export interface UserRegistrationData {
  userId: string;
  nickname: string;
  password: string;
  name: string;
  email: string;
  cohort: number;
  avatar_url: string; 
}

export interface ProfileData {
  id: string;
  name: string;
  nickname: string;
  cohort: number;
  role: 'student' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuthError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  hint?: string;
}

// 🎯 인증 관련 공통 타입들
export type AuthRole = 'student' | 'admin';
export type AuthStatus = 'pending' | 'approved' | 'rejected';