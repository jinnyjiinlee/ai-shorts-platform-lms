/**
 * 범용 생성 모달을 위한 타입 정의
 * - 다양한 폼 필드 타입을 지원
 * - 확장 가능한 구조로 설계
 */

export type FieldType = 
  | 'text'           // 일반 텍스트 입력
  | 'textarea'       // 긴 텍스트 입력
  | 'markdown'       // 마크다운 에디터
  | 'select'         // 드롭다운 선택
  | 'checkbox'       // 체크박스
  | 'radio'          // 라디오 버튼
  | 'date'           // 날짜 선택
  | 'datetime-local' // 날짜+시간 선택
  | 'number';        // 숫자 입력

/**
 * 선택 옵션 (select, radio에서 사용)
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * 개별 필드 설정
 */
export interface FormField {
  name: string;              // 필드명 (폼 데이터 키)
  label: string;             // 표시될 라벨
  type: FieldType;           // 필드 타입
  placeholder?: string;      // placeholder 텍스트
  required?: boolean;        // 필수 여부
  maxLength?: number;        // 최대 글자수
  minLength?: number;        // 최소 글자수
  showCharacterCount?: boolean; // 글자수 표시 여부
  options?: SelectOption[];  // select, radio 옵션들
  defaultValue?: any;        // 기본값
  validation?: (value: any) => string | null; // 커스텀 검증 함수
  className?: string;        // 추가 CSS 클래스
}

/**
 * UniversalCreateModal Props
 */
export interface UniversalCreateModalProps {
  show: boolean;             // 모달 표시 여부
  title: string;             // 모달 제목
  onClose: () => void;       // 닫기 콜백
  onSubmit: (formData: Record<string, any>) => Promise<void>; // 제출 콜백
  fields: FormField[];       // 폼 필드 설정들
  submitText?: string;       // 제출 버튼 텍스트
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'; // 모달 크기
  description?: string;      // 모달 설명
}