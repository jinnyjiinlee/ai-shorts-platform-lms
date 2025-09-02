export interface Review {
  id: string;
  student_id: string;
  title: string;
  content: string;
  cohort: string;
  created_at: string;
  updated_at: string;
  student_nickname?: string;
}

/**
 * 리뷰 작성/수정 시 사용하는 폼 데이터
 * - 사용자 입력을 받는 필드들만 포함
 * - id, timestamps는 서버에서 처리
 */
export interface ReviewFormData {
  title: string;
  content: string;
  cohort: string;
}

/**
 * 기수 옵션 정의
 * - UI에서 선택 가능한 기수 목록
 * - 확장성을 위해 별도 타입으로 관리
 */
export interface CohortOption {
  value: string; // 실제 저장될 값
  label: string; // UI에 표시될 텍스트
}
