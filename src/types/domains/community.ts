// 🎯 Community 도메인 타입 정의
// 모든 커뮤니티 관련 타입을 여기서 중앙 관리

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  cohort: string | 'all' | number;
  author: string;
  createdAt: string;
  isPinned?: boolean;
  pinned?: boolean;
}

export interface Column {
  id: string | number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  cohort?: string | number;
  likes?: number;
  commentCount?: number;
  isLiked?: boolean;
  isPublished?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isOwner?: boolean;
}

// 🎯 커뮤니티 관련 공통 타입들  
export type CohortType = string | 'all' | number;
export type AnnouncementPriority = 'normal' | 'high' | 'urgent';