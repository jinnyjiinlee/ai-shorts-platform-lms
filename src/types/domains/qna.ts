// 🎯 통합 Q&A 도메인 타입 정의
// 모든 Q&A 관련 타입을 여기서 중앙 관리

export interface Question {
  id: string;
  title: string;
  content: string;
  student_id: string;
  student_name?: string;
  student_nickname?: string;
  student_avatar_url?: string; // 학생 아바타 URL 추가
  cohort?: string; // profiles 테이블에서 join으로 가져옴
  status: 'open' | 'answered';
  created_at: string;
  updated_at: string;
  answer?: Answer;
  is_recommended?: boolean; // 추천 여부
}

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  admin_id: string;
  admin_name?: string;
  created_at: string;
  updated_at: string;
}

// 질문 작성 폼 데이터
export interface QuestionFormData {
  title: string;
  content: string;
}

// 답변 작성 폼 데이터
export interface AnswerFormData {
  content: string;
}

// 🎯 Q&A 관련 공통 타입들
export type QuestionStatus = 'open' | 'answered';