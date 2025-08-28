// 🎯 Resource 도메인 타입 정의
// 모든 학습 자료 관련 타입을 여기서 중앙 관리

export interface LearningMaterial {
  id: number;
  title: string;
  description: string;
  week: number;
  cohort: string;
  uploadDate: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  isPublished?: boolean;
}

// 🎯 학습 자료 관련 공통 타입들
export type FileType = 'pdf' | 'video' | 'image' | 'document' | 'other';
export type ResourceStatus = 'active' | 'archived' | 'draft';