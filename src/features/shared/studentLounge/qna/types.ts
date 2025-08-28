// QnA 관련 타입 정의
export interface Question {
  id: string;
  title: string;
  content: string;
  student_id: string;
  student_name?: string;
  student_nickname?: string;
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
