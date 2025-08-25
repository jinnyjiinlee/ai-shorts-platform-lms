// 대시보드 관련 타입 정의
export interface CohortData {
  cohort: string;
  name: string;
  totalStudents: number;
  submissionRate: number;
  activeStudents: number;
  totalMissions: number;
  completedMissions: number;
  status: 'active' | 'completed' | 'upcoming';
  color: string;
  statusColor: string;
  weeklySubmissions: WeeklySubmission[];
}

export interface WeeklySubmission {
  week: number;
  submissions: number;
  totalStudents: number;
  rate: number;
}

export interface OverallStats {
  totalActiveStudents: number;
  averageSubmissionRate: number;
  totalActiveMissions: number;
  activeStudentsCount: number;
}