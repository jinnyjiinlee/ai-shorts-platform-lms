// 칼럼 관련 타입 정의
export interface Column {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  likes: number;
  category: string;
  tags: string[];
  thumbnail?: string;
  isLiked?: boolean;
}

export interface ColumnFilters {
  searchTerm: string;
  selectedCategory: string;
}