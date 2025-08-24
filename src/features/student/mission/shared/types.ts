// 미션 관리 관련 타입 정의
export interface Mission {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  week: number;
  isSubmitted?: boolean;
  submittedAt?: string;
  status: 'pending' | 'submitted' | 'completed';
  submission_type: 'file' | 'text';
  feedback?: string;
}

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