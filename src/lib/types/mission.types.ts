export interface Mission {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published' | 'closed';
  category: string;
  deadline?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
  created_by: string;
  due_date: string;
  cohort: string;
  week: number;
  submissions?: MissionSubmission[];
}

export interface MissionSubmission {
  id: string;
  mission_id: string;
  student_id: string;
  content: string;
  attachments?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  score?: number;
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;

  studentName?: string; // ← 학생 이름
  grade?: string | number; // ← 점수/등급
  fileName?: string; // ← 파일 이름
  submittedAt?: string; // ← 제출 시간 (다른 형식)
}

export interface MissionCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface StudentMissionProgress {
  mission: Mission;
  submission?: MissionSubmission;
  isCompleted: boolean;
  canSubmit: boolean;
  deadline?: string;
}
