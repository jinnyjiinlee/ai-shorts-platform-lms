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