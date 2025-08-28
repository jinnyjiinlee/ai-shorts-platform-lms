// 🎯 통합 Dashboard 도메인 타입 정의  
// 모든 대시보드 관련 타입을 여기서 중앙 관리

export interface DashboardStats {
  totalStudents: number;
  totalMissions: number;
  completedSubmissions: number;
  pendingSubmissions: number;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  completedMissions: number;
  totalMissions: number;
  completionRate: number;
  lastActivity: string;
}

export interface MissionAnalytics {
  missionId: string;
  missionTitle: string;
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  averageScore?: number;
}