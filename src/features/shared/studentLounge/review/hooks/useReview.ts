import { useState, useEffect } from 'react';
import { Review, ReviewFormData, CohortOption } from '@/types/domains/review';
import { getReviews, createReview, updateReview, deleteReview, getAvailableCohorts } from '../services/reviewService';

/**
 * Review 기능을 위한 커스텀 훅
 * - 리뷰 CRUD 작업 관리
 * - 모달 상태 관리
 * - 기수별 필터링 로직
 * - QnA의 useQnA 패턴을 재사용하되 리뷰 특화 기능 추가
 */

interface UseReviewReturn {
  // 데이터 상태
  reviews: Review[];
  loading: boolean;
  error: string | null;

  // 기수 관련
  availableCohorts: CohortOption[];
  selectedCohort: string | 'all';
  setSelectedCohort: (cohort: string | 'all') => void;
  filteredReviews: Review[];

  // 모달 상태
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  selectedReview: Review | null;

  // CRUD 함수들
  handleCreateReview: (formData: ReviewFormData) => Promise<void>;
  handleUpdateReview: (id: string, formData: ReviewFormData) => Promise<void>;
  handleDeleteReview: (id: string) => Promise<void>;
  handleViewReview: (review: Review) => void;
  refreshReviews: () => Promise<void>;
}

/**
 * useReview 훅의 메인 함수
 * @param userRole 사용자 권한 ('admin' | 'student')
 */
export function useReview(userRole: 'admin' | 'student'): UseReviewReturn {
  // === 데이터 상태 ===
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === 기수 필터링 상태 ===
  const [selectedCohort, setSelectedCohort] = useState<string | 'all'>('all');
  const availableCohorts = getAvailableCohorts();

  // === 모달 상태 관리 ===
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  /**
   * 리뷰 목록을 불러오는 함수
   * - 컴포넌트 마운트 시 및 새로고침 시 호출
   * - 에러 상태도 함께 관리
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰를 불러오는데  실패했습니다.');
      console.error('리뷰 조회 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 기수별 필터링된 리뷰 목록
   * - 'all' 선택 시 모든 리뷰 표시
   * - 특정 기수 선택 시 해당 기수만 필터링
   */
  const filteredReviews =
    selectedCohort === 'all' ? reviews : reviews.filter((review) => review.cohort === selectedCohort);

  /**
   * 새 리뷰 작성 핸들러
   * - 성공 시 목록 새로고침 및 모달 닫기
   * - 실패 시 에러 메시지 표시
   */
  const handleCreateReview = async (formData: ReviewFormData) => {
    try {
      await createReview(formData);
      await fetchReviews(); // 목록 새로고침
      setShowCreateModal(false);
    } catch (err) {
      throw err; // 모달에서 에러 처리하도록 전파
    }
  };

  /**
   * 리뷰 수정 핸들러
   * - 작성자 본인 또는 관리자만 수정 가능
   * - 성공 시 목록 새로고침 및 모달 닫기
   */
  const handleUpdateReview = async (id: string, formData: ReviewFormData) => {
    try {
      await updateReview(id, formData);
      await fetchReviews();
      setShowDetailModal(false);
    } catch (err) {
      throw err;
    }
  };

  /**
   * 리뷰 삭제 핸들러
   * - 확인 후 삭제 실행
   * - 성공 시 목록 새로고침
   */
  const handleDeleteReview = async (id: string) => {
    if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(id);
      await fetchReviews();
      setShowDetailModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  /**
   * 리뷰 상세보기 핸들러
   * - 선택된 리뷰 설정 및 상세 모달 열기
   */
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  /**
   * 리뷰 목록 새로고침 함수
   * - 외부에서 호출 가능한 공개 인터페이스
   */
  const refreshReviews = fetchReviews;

  // 컴포넌트 마운트 시 리뷰 목록 로드
  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    // 데이터 상태
    reviews,
    loading,
    error,

    // 기수 관련
    availableCohorts,
    selectedCohort,
    setSelectedCohort,
    filteredReviews,

    // 모달 상태
    showCreateModal,
    setShowCreateModal,
    showDetailModal,
    setShowDetailModal,
    selectedReview,

    // CRUD 함수들
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
    handleViewReview,
    refreshReviews,
  };
}
