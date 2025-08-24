// MissionTracking 관련 타입 정의

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
  userId: string;
  email: string;
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