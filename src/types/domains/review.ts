export interface Review {
  id: string;
  student_id: string;
  title: string;
  content: string;
  cohort: string;
  created_at: string;
  updated_at: string;
  student_nickname?: string;
  // 리뷰는 기본적으로 모두 발행됨 (수강생이 작성하면 바로 보임)
  isPublished: boolean;
  isPinned: boolean; // 관리자만 중요한 후기를 고정 가능
}

/**
 * 리뷰 작성/수정 시 사용하는 폼 데이터
 * - 사용자 입력을 받는 필드들만 포함
 * - id, timestamps, cohort는 서버에서 처리
 * - cohort는 사용자 프로필에서 자동으로 가져옴
 * - isPinned는 관리자만 수정 가능
 */
export interface ReviewFormData {
  title: string;
  content: string;
  // cohort는 사용자 프로필에서 자동으로 설정됨 (폼에서 제외)
  // 수강생이 작성할 때는 항상 발행됨 (isPublished: true)
  // isPinned는 폼에서 제외 (관리자가 별도로 관리)
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
