// 🎯 통합 타입 Export
// 모든 도메인 타입을 중앙에서 관리하여 import 경로를 단순화

// 도메인 타입들
export * from './domains/mission';
export * from './domains/user';
export * from './domains/auth';
export * from './domains/dashboard';
export * from './domains/qna';

// 기존 lib/types와의 호환성을 위한 re-export
export type { 
  Mission, 
  MissionSubmission, 
  MissionCategory, 
  StudentMissionProgress,
  MissionStatus,
  SubmissionStatus,
  MissionDifficulty,
  SubmissionType
} from './domains/mission';

export type { 
  User, 
  UserProfile, 
  UserStats,
  UserRole,
  UserStatus
} from './domains/user';

export type { 
  UserRegistrationData, 
  ProfileData, 
  AuthError,
  AuthRole,
  AuthStatus
} from './domains/auth';

export type { 
  DashboardStats, 
  StudentProgress, 
  MissionAnalytics 
} from './domains/dashboard';

export type { 
  Question, 
  Answer, 
  QuestionFormData, 
  AnswerFormData,
  QuestionStatus
} from './domains/qna';