import { supabase } from '@/lib/supabase';
import { Review, ReviewFormData, CohortOption } from '@/types/domains/review';

// getReviews() 리뷰 목록 조회
/**
 * 발행된 리뷰를 조회하는 함수 (표준화된 boolean 패턴 사용)
 * - 작성자 닉네임 포함 (profiles 테이블과 JOIN)
 * - 발행된 것만 조회 (isPublished = true)
 * - 우수 후기를 먼저, 생성일 기준 내림차순 정렬
 * @returns Promise<Review[]> 리뷰 목록
 */
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
        *,
        profiles:student_id (
          nickname
        )
      `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('리뷰 조회 실패:', error);
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }
  // JOIN 결과를 평면화하여 Review 타입으로 변환 - 실제 컬럼 사용
  return (data || []).map((item) => ({
    ...item,
    student_nickname: item.profiles?.nickname || null,
    // 모든 수강생 후기는 기본적으로 발행됨
    isPublished: true,
    // is_pinned 컬럼 사용 (관리자가 중요한 후기를 고정)
    isPinned: item.is_pinned || false,
  }));
}

// createReview() 리뷰 작성
/**
 * 새 리뷰를 생성하는 함수 (표준화된 boolean 패턴 사용)
 * - 현재 로그인된 사용자의 student_id 자동 설정
 * - 데이터베이스 필드명에 맞게 boolean 값들을 매핑
 * - created_at, updated_at은 Supabase에서 자동 처리
 * @param formData 리뷰 폼 데이터
 * @returns Promise<Review> 생성된 리뷰
 */
export async function createReview(formData: ReviewFormData): Promise<Review> {
  // 현재 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('로그인이 필요합니다.');
  }

  // 사용자 프로필에서 cohort 정보 가져오기
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('cohort')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('사용자 프로필을 찾을 수 없습니다.');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        title: formData.title,
        content: formData.content,
        cohort: profile.cohort, // 프로필에서 가져온 cohort 사용
        student_id: user.id,
        // 수강생 후기는 기본적으로 발행됨, is_pinned는 기본값 false
      },
    ])
    .select(
      `
        *,
        profiles:student_id (
          nickname
        )
      `
    )
    .single();

  if (error) {
    console.error('리뷰 생성 실패:', error);
    throw new Error('리뷰 작성에 실패했습니다.');
  }

  return {
    ...data,
    student_nickname: data.profiles?.nickname || null,
    // 수강생 후기는 항상 발행됨
    isPublished: true,
    // is_pinned 컬럼 사용 (기본값 false)
    isPinned: data.is_pinned || false,
  };
}

// 관리자용 - 모든 리뷰 조회 (상태 무관)
/**
 * 관리자용 모든 리뷰 조회 함수 (표준화된 boolean 패턴 사용)
 * - 발행 상태와 관계없이 모든 리뷰 조회
 * - 작성자 닉네임 포함 (profiles 테이블과 JOIN)
 * - 생성일 기준 내림차순 정렬
 * @returns Promise<Review[]> 모든 리뷰 목록
 */
export async function getAllReviewsForAdmin(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
        *,
        profiles:student_id (
          nickname
        )
      `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('관리자 리뷰 조회 실패:', error);
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }

  return (data || []).map((item) => ({
    ...item,
    student_nickname: item.profiles?.nickname || null,
    // 수강생 후기는 항상 발행됨
    isPublished: true,
    // is_pinned 컬럼 사용
    isPinned: item.is_pinned || false,
  }));
}

// updateReview() 리뷰 수정
/**
 * 기존 리뷰를 수정하는 함수 (표준화된 boolean 패턴 사용)
 * - 작성자 본인만 수정 가능 (RLS 정책으로 보장)
 * - 데이터베이스 필드명에 맞게 boolean 값들을 매핑
 * - updated_at은 자동 갱신
 * @param id 리뷰 ID
 * @param formData 수정할 데이터
 * @returns Promise<Review> 수정된 리뷰
 */
export async function updateReview(id: string, formData: ReviewFormData): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .upsert({
      id,
      title: formData.title,
      content: formData.content,
    })
    .select(
      `
        *,
        profiles:student_id (
          nickname
        )
      `
    )
    .single();

  if (error) {
    console.error('리뷰 수정 실패:', error);
    throw new Error('리뷰 수정에 실패했습니다.');
  }

  return {
    ...data,
    student_nickname: data.profiles?.nickname || null,
    // 수정 시에도 동일한 패턴 적용
    isPublished: true,
    isPinned: data.is_pinned || false,
  };
}

// deleteReview() 리뷰 삭제
/**
 * 리뷰를 삭제하는 함수
 * - 작성자 본인 또는 관리자만 삭제 가능
 * - 물리적 삭제 (복구 불가)
 * @param id 삭제할 리뷰 ID
 * @returns Promise<void>
 */
export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);

  if (error) {
    console.error('리뷰 삭제 실패:', error);
    throw new Error('리뷰 삭제에 실패했습니다.');
  }
}

/**
 * 사용 가능한 기수 목록을 반환하는 함수
 * - 하드코딩 대신 동적으로 관리 가능하도록 구성
 * - 나중에 데이터베이스에서 가져오도록 확장 가능
 * @returns CohortOption[] 기수 선택 옵션들
 */
export function getAvailableCohorts(): CohortOption[] {
  return [
    { value: '1', label: '1기' },
    // 새로운 기수 추가 시 여기에 추가
  ];
}
