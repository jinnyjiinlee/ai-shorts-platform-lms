import React from 'react';
import { Badge } from '../Badge';
/**
 * 기수를 표시하는 전용 배지 컴포넌트
 * - 기수별로 다른 색상을 자동 적용
 * - 재사용 가능한 UI 컴포넌트
 * - Badge 컴포넌트를 기반으로 확장
 */

interface CohortBadgeProps {
  cohort: string; // 기수 번호 (예: "1", "2", "3")
  size?: 'sm' | 'md' | 'lg'; // 배지 크기
  className?: string; // 추가 CSS 클래스
}

/**
 * 기수 번호에 따른 색상 매핑
 * - 각 기수별로 고유한 색상 조합
 * - 시각적 구분을 위한 다양한 색상 팔레트
 */
const getCohortVariant = (cohort: string) => {
  const cohortNum = parseInt(cohort);

  // 기수 번호에 따른 색상 순환 (5가지 색상)
  switch (cohortNum % 5) {
    case 1:
      return 'success'; // 초록색
    case 2:
      return 'default'; // 회색
    case 3:
      return 'warning'; // 주황색
    case 4:
      return 'danger'; // 빨간색
    case 0:
      return 'info'; // 파란색
    default:
      return 'default';
  }
};

/**
 * CohortBadge 컴포넌트
 * @param cohort 표시할 기수
 * @param size 배지 크기 (기본: sm)
 * @param className 추가 CSS 클래스
 */
export default function CohortBadge({ cohort, size = 'sm', className }: CohortBadgeProps) {
  return (
    <Badge variant={getCohortVariant(cohort)} size={size} className={className}>
      {cohort}기
    </Badge>
  );
}
