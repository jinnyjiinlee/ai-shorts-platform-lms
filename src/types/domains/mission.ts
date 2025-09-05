// 🎯 통합 Mission 도메인 타입 정의
// 모든 Mission 관련 타입을 여기서 중앙 관리

export interface Mission {
  // 🏗️ 핵심 DB 필드 (snake_case - DB 기준)
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published' | 'closed';
  category: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
  created_by: string;
  due_date: string;
  cohort: string;
  week: number;

  // 🎨 UI에서 사용되는 선택적 필드들
  deadline?: string;
  submissions?: MissionSubmission[];
  isSubmitted?: boolean;
  submittedAt?: string;
  dueDateFormatted?: string;
  submissionContent?: string;
  feedback?: string;
  submission_type?: 'file' | 'text';
  authorNickname?: string;
}

export interface MissionSubmission {
  // 🏗️ 핵심 DB 필드
  id: string;
  mission_id: string;
  student_id: string;
  content: string;
  attachments?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'in_review' | 'submitted';
  score?: number;
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;

  // 🎨 UI에서 사용되는 계산된 필드들
  studentName?: string;
  grade?: string | number;
  fileName?: string;
  fileSize?: string;
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

// 🎯 미션 관련 공통 타입들
export type MissionStatus = 'draft' | 'published' | 'closed';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_review' | 'submitted';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type SubmissionType = 'file' | 'text';