// 🎯 통합 타입에서 Mission 가져와서 재export
import type { Mission } from '@/types/domains/mission';
export type { Mission };

export interface MissionCardProps {
  mission: Mission;
  onClick?: (mission: Mission) => void;
}

export interface MissionListProps {
  missions: Mission[];
  onMissionSelect: (mission: Mission) => void;
  getStatusColor: (status: string, isSubmitted?: boolean) => string;
  getStatusText: (status: string, isSubmitted?: boolean) => string;
}

export interface WeekSelectorProps {
  selectedWeek: number | null;
  onWeekChange: (week: number | null) => void;
  missionsByWeek: Record<string, Mission[]>;
}

export interface MissionModalProps {
  mission: Mission | null;
  onClose: () => void;
  onSubmit: (content: string) => void;
  refreshMissions: () => void;
}

export interface Submission {
  id: string;
  missionId: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  fileName?: string;
  fileSize?: string;
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