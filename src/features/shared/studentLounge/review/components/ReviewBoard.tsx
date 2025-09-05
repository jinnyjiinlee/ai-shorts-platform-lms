'use client';

import { useState, useEffect } from 'react';
import { useReview } from '../hooks/useReview';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem, FilterOption } from '@/features/shared/board/components/UniversalBoard';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';
import UniversalDetailModal from '@/features/shared/ui/Modal/UniversalDetailModal';
import UniversalCardView from '@/features/shared/board/components/UniversalCardView';
import CohortBadge from '@/features/shared/ui/Badge/CohortBadge';
import { FormField } from '@/types/ui/universalModal';
import { Review } from '@/types/domains/review';
import { supabase } from '@/lib/supabase/client';

interface ReviewBoardProps {
  userRole: 'admin' | 'student'; // 사용자 역할
}

/**
 * ReviewBoard 컴포넌트
 * @param userRole 현재 사용자의 역할 ('admin' 또는 'student')
 */
export default function ReviewBoard({ userRole }: ReviewBoardProps) {
  // 뷰 전환 상태
  const [viewType, setViewType] = useState<'board' | 'card'>('card'); // 카드뷰가 기본
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  /**
   * useReview 훅에서 모든 리뷰 관련 로직과 데이터 가져오기
   * - 리뷰 목록, 로딩/에러 상태
   * - 모달 상태 관리
   * - CRUD 함수들
   * - 기수별 필터링 로직
   * - 페이지네이션 로직
   */
  const {
    reviews, // 전체 리뷰 목록
    loading, // 로딩 상태
    error, // 에러 상태
    availableCohorts, // 선택 가능한 기수 목록
    selectedCohort, // 현재 선택된 기수 필터
    setSelectedCohort, // 기수 필터 변경 함수
    filteredReviews, // 필터링된 리뷰 목록
    paginatedReviews, // 페이지네이션이 적용된 리뷰 목록
    currentPage, // 현재 페이지
    totalPages, // 전체 페이지 수
    handlePageChange, // 페이지 변경 함수
    showCreateModal, // 작성 모달 상태
    setShowCreateModal, // 작성 모달 제어
    showDetailModal, // 상세 모달 상태
    setShowDetailModal, // 상세 모달 제어
    selectedReview, // 선택된 리뷰
    handleCreateReview, // 리뷰 작성 함수
    handleUpdateReview, // 리뷰 수정 함수
    handleDeleteReview, // 리뷰 삭제 함수
    handleViewReview, // 리뷰 상세보기 함수
  } = useReview(userRole);

  /**
   * 날짜 포맷팅 함수
   * - ISO 문자열을 한국어 형식으로 변환
   * - "2024년 1월 15일 오후 2:30" 형태로 표시
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * 기수 필터 변경 핸들러
   * - string과 'all' 타입을 모두 받을 수 있도록 타입 변환
   * - UniversalBoard의 onFilterChange와 연동
   */
  const handleCohortFilterChange = (value: string) => {
    setSelectedCohort(value as string | 'all');
  };

  // 표시할 데이터 (페이지네이션 적용된 데이터)
  const displayReviews = paginatedReviews;

  /**
   * Review 데이터를 UniversalBoard에서 사용하는 BoardItem 형태로 변환
   * - 각 리뷰마다 기수 배지 추가
   * - 제목, 내용, 작성자, 작성일 매핑
   */
  const boardItems: BoardItem[] = displayReviews.map((review) => ({
    id: review.id,
    title: review.title,
    content: review.content,
    author: review.student_nickname || '작성자', // 닉네임 또는 기본값
    authorId: review.student_id, // 작성자 ID 추가
    avatarUrl: review.student_avatar_url, // 작성자 아바타 URL 추가
    createdAt: formatDate(review.created_at),
    isPublished: true, // 리뷰는 작성 즉시 공개
    badges: [
      // 기수 배지를 각 리뷰에 표시
      <CohortBadge key='cohort' cohort={review.cohort} size='sm' className='mr-1' />,
    ],
  }));

  /**
   * 관리자용 기수 필터 옵션 생성
   * - '전체' 옵션 + 각 기수별 옵션
   * - 각 기수별 리뷰 개수도 함께 표시
   * - 학생에게는 필터가 보이지 않음
   */
  const filterOptions: FilterOption[] =
    userRole === 'admin'
      ? [
          {
            label: '전체',
            value: 'all',
            count: reviews.length,
            variant: 'default',
          },
          ...availableCohorts.map((cohort) => ({
            label: cohort.label,
            value: cohort.value,
            count: reviews.filter((review) => review.cohort === cohort.value).length,
            variant: 'success' as const, // 기수별 필터는 초록색으로 통일
          })),
        ]
      : [];

  return (
    <div className='space-y-6'>
      {/* UniversalBoard에 뷰 전환 기능 통합 */}
      <UniversalBoard
        title='수강생 후기'
        description='수강생들의 솔직한 후기와 경험담을 공유하는 공간'
        icon={<ChatBubbleLeftRightIcon className='w-6 h-6 text-purple-600' />}
        iconBgColor='bg-purple-100'
        createButtonText='후기 작성하기'
        items={boardItems}
        userRole={userRole}
        currentUserId={currentUserId || undefined}
        loading={loading}
        error={error || undefined}
        // 기수 필터링 (관리자만)
        filterOptions={filterOptions}
        selectedFilter={userRole === 'admin' ? selectedCohort : undefined}
        onFilterChange={userRole === 'admin' ? handleCohortFilterChange : undefined}
        // 뷰 전환 기능
        showViewToggle={true}
        viewType={viewType}
        onViewTypeChange={setViewType}
        cardComponent={(props) => (
          <UniversalCardView
            {...props}
            config={{
              accentColor: 'purple',
              gradientColors: { from: 'purple-50', to: 'pink-50' },
            }}
            renderBadges={(item) => [
              <CohortBadge key="cohort" cohort={(item as Review).cohort} size="sm" className="mr-1" />
            ]}
          />
        )}
        cardData={displayReviews.map(review => ({
          ...review,
          author: review.student_nickname || '작성자',
          authorId: review.student_id,
          avatarUrl: review.student_avatar_url,
        }))}
        // 페이지네이션
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        // 액션 함수들
        onCreateItem={() => setShowCreateModal(true)}
        onViewItem={(item) => {
          const review = filteredReviews.find((r) => r.id === item.id);
          if (review) handleViewReview(review);
        }}
        onEditItem={(item) => {
          const review = filteredReviews.find((r) => r.id === item.id);
          if (review) handleViewReview(review);
        }}
        onDeleteItem={(id) => {
          handleDeleteReview(id);
        }}
      />

      {/* 리뷰 작성 모달 */}
      <UniversalCreateModal
        show={showCreateModal}
        title="후기 작성하기"
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (formData) => {
          await handleCreateReview({
            title: formData.title,
            content: formData.content,
          });
        }}
        fields={[
          {
            name: 'title',
            type: 'text' as const,
            label: '후기 제목',
            required: true,
            maxLength: 100,
            placeholder: '후기 제목을 입력하세요',
          },
          {
            name: 'content',
            type: 'textarea' as const,
            label: '후기 내용',
            required: true,
            maxLength: 2000,
            placeholder: '후기 내용을 입력하세요...',
            showCharacterCount: true,
          },
        ]}
      />

      {/* 리뷰 상세보기/수정 모달 */}
      <UniversalDetailModal
        show={showDetailModal}
        item={selectedReview}
        userRole={userRole}
        title="후기 상세보기"
        editTitle="후기 수정"
        onClose={() => setShowDetailModal(false)}
        onUpdate={async (id: string, formData: Record<string, any>) => {
          await handleUpdateReview(id, {
            title: formData.title,
            content: formData.content,
          });
        }}
        fields={[
          {
            name: 'title',
            type: 'text' as const,
            label: '후기 제목',
            required: true,
            maxLength: 100,
          },
          {
            name: 'content',
            type: 'textarea' as const,
            label: '후기 내용',
            required: true,
            maxLength: 2000,
          },
        ]}
        renderHeader={(item) => (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <CohortBadge cohort={(item as Review).cohort} size="md" />
              <span className="text-sm text-slate-600">
                {(item as Review).student_nickname || '작성자'}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
