// 🎨 Student Mission UI 전용 타입들  
// 이 파일은 Student Mission 기능에서만 사용되는 UI 컴포넌트 타입들을 관리

import { Mission } from '@/types/domains/mission';

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

export interface WeeklyProgress {
  week: number;
  total: number;
  completed: number;
  missions: Mission[];
}