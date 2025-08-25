// 대시보드 관련 타입 정의
export interface CohortData {
  cohort: string;
  name: string;
  totalStudents: number;
  submissionRate: number; // 평균 완료율
  perfectCompletionCount: number; // 모든 미션을 완료한 학생 수
  perfectCompletionRate: number; // 완벽 완료 비율
  participatingStudents: number; // 참여 학생 수 (하나라도 제출한 학생)
  currentWeek: number; // 현재 주차
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