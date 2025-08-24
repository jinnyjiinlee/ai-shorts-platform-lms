// 공지사항 관련 타입 정의
export interface Announcement {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  date: string;
  isNew: boolean;
  priority: 'urgent' | 'important' | 'normal';
  category: string;
}

export interface AnnouncementFilters {
  searchTerm: string;
}