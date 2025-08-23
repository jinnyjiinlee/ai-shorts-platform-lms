export interface Mission {
  id: string; // UUID
  title: string;
  description: string;
  week: number;
  dueDate: string;
  isSubmitted: boolean;
  submittedAt?: string;
  status: 'pending' | 'submitted' | 'completed';
  feedback?: string;
}

export interface MissionStats {
  totalMissions: number;
  completedMissions: number;
  completionRate: number;
}

export interface WeekSelectorProps {
  selectedWeek: number | null;
  onWeekChange: (week: number | null) => void;
  missionsByWeek: Record<number, Mission[]>;
}

export interface MissionCardProps {
  mission: Mission;
  index: number;
  totalMissions: number;
  onClick?: (mission: Mission) => void;
}

export interface MissionModalProps {
  mission: Mission | null;
  onClose: () => void;
  onSubmit: (missionId: string) => void; // UUID
  refreshMissions?: () => Promise<void>;
}

export interface MissionListProps {
  missions: Mission[];
  onMissionSelect: (mission: Mission) => void;
  getStatusColor: (status: string, isSubmitted: boolean) => string;
  getStatusText: (status: string, isSubmitted: boolean) => string;
}

export interface ProgressCardsProps {
  stats: MissionStats;
}