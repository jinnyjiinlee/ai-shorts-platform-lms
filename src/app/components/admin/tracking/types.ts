// 미션 추적 관련 타입 정의

export interface WeeklyProgress {
  week: number;
  weekName: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  submitted: number;
  inProgress: number;
  notStarted: number;
  submissionRate: number;
  previousWeekRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CohortWeeklyData {
  cohort: number;
  weeks: WeeklyProgress[];
  overallRate: number;
}

export interface WeeklyProgressStats {
  totalSubmitted: number;
  totalStudents: number;
  totalInProgress: number;
  overallRate: number;
  notStarted: number;
}