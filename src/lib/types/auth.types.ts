export interface UserRegistrationData {
  userId: string;
  nickname: string;
  password: string;
  name: string;
  email: string;
  cohort: number;
  avatar_url: string; 
}

// 사용
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