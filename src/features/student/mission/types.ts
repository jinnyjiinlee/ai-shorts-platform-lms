// 미션 관리 관련 타입 정의
export interface Mission {
  id: string;
  title: string;
  description: string;
  due_date: string;
  cohort: number;
  week: number;
  created_at: string;
  created_by: string;
  submissions?: Submission[];
  isSubmitted?: boolean; // useStudentMissions에서 사용
}

export interface MissionCardProps {
  mission: Mission;
  onClick?: (mission: Mission) => void;
}

export interface Submission {
  id: string; // UUID
  missionId: string; // UUID
  studentName: string;
  studentId: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  status: 'submitted';
  grade?: number;
  feedback?: string;
}

export interface WeeklyProgress {
  week: number;
  total: number;
  completed: number;
  missions: Mission[];
}