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
  summary?: string;
  author: string;
  author_id?: string;
  cohort?: string;
  
  // 상태 관리
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  
  // 메타데이터
  slug?: string;
  thumbnail_url?: string;
  meta_description?: string;
  reading_time?: number;
  
  // 통계
  view_count: number;
  like_count: number;
  isLiked?: boolean;
  
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

// Column 생성용 DTO
export interface CreateColumnDto {
  title: string;
  content: string;
  summary?: string;
  cohort?: string;
  status?: 'draft' | 'published';
  is_featured?: boolean;
  slug?: string;
  thumbnail_url?: string;
  meta_description?: string;
}

// Column 수정용 DTO
export interface UpdateColumnDto {
  title?: string;
  content?: string;
  summary?: string;
  cohort?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  slug?: string;
  thumbnail_url?: string;
  meta_description?: string;
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