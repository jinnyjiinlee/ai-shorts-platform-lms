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

export interface ServiceAuthError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  hint?: string;
}