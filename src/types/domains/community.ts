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
  id: string;
  title: string;
  content: string;
  author: string;
  author_id?: string;
  
  // 상태 관리 - 공지사항과 동일한 boolean 패턴으로 표준화
  isPublished: boolean;
  isFeatured: boolean;
  
  // 통계
  view_count: number;
  like_count: number;
  
  // 시간
  created_at: string;
  updated_at?: string;
  published_at?: string;
  
  // 관계
  profiles?: {
    name?: string;
    nickname?: string;
  };
}

// Column 생성용 DTO - 공지사항과 동일한 boolean 패턴으로 표준화
export interface CreateColumnDto {
  title: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

// Column 수정용 DTO - 공지사항과 동일한 boolean 패턴으로 표준화
export interface UpdateColumnDto {
  title?: string;
  content?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
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