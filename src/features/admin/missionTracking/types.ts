// 🎨 Mission Tracking UI 전용 타입들
// 이 파일은 Admin Mission Tracking 기능에서만 사용되는 UI 타입들을 관리

export interface WeeklyData {
  week: number;
  missionTitle: string;
  missionId: string;
  totalStudents: number;
  submittedCount: number;
  submissionRate: number;
  dueDate: string;
}

export interface StudentSubmissionDetail {
  studentId: string;
  studentName: string;
  avatarUrl?: string | null;
  submissionStatus: 'submitted' | 'not_submitted';
  submittedAt?: string;
  submissionContent?: string;
  grade?: number;
  feedback?: string;
}

export interface StudentSubmissionTableProps {
  selectedCohort: number;
  weeklyData: WeeklyData[];
  allStudents: StudentSubmissionDetail[];
  studentSubmissions: Map<
    string,
    Map<
      string,
      {
        submitted: boolean;
        content?: string;
        submittedAt?: string;
      }
    >
  >;
  onSubmissionClick: (submission: {
    studentName: string;
    week: number;
    missionTitle: string;
    content: string;
    submittedAt: string;
    studentId: string;
  }) => void;
}

export interface TrackingHeaderProps {
  selectedCohort: number;
  availableCohorts: number[];
  onCohortChange: (cohort: number) => void;
}

export interface TrackingStatsProps {
  overallRate: number;
  totalSubmissions: number;
  totalExpected: number;
}

export interface SubmissionDetailPanelProps {
  submission: {
    studentName: string;
    week: number;
    missionTitle: string;
    content: string;
    submittedAt: string;
    studentId: string;
  } | null;
  onClose: () => void;
}