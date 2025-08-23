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

export interface UserStats {
  totalMissions: number;
  completedMissions: number;
  pendingSubmissions: number;
  totalPoints: number;
  rank?: number;
  completionRate: number;
}