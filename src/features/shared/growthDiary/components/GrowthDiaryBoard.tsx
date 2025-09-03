'use client';

import { useState } from 'react';
import { useGrowthDiary } from '../hooks/useGrowthDiary';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import UniversalCreateModal from '@/features/shared/ui/Modal/UniversalCreateModal';
import UniversalDetailModal from '@/features/shared/ui/Modal/UniversalDetailModal';
import UniversalCardView from '@/features/shared/board/components/UniversalCardView';
import { GrowthDiary } from '@/types/domains/growthDiary';
import { Pagination } from '@/features/shared/ui/Pagination';

interface GrowthDiaryBoardProps {
  userRole: 'admin' | 'student';
  cohort: string;
}

export default function GrowthDiaryBoard({ userRole, cohort }: GrowthDiaryBoardProps) {
  // 뷰 전환 상태
  const [viewType, setViewType] = useState<'board' | 'card'>('card'); // 카드뷰가 기본

  // 날짜 포맷팅 함수
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

  // useGrowthDiary Hook에서 모든 로직과 데이터 가져오기
  const {
    diaries,
    loading,
    error,
    showDiaryModal,
    setShowDiaryModal,
    showDetailModal,
    selectedDiary,
    setShowDetailModal,
    currentUserId,

    // 페이지네이션 관련
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateDiary,
    handleDeleteMyDiary,
    handleAdminDelete,
    handleEditDiary,
    handleViewDiary,
  } = useGrowthDiary(userRole, cohort);

  // Diary를 BoardItem으로 변환
  const boardItems: BoardItem[] = paginatedDiaries.map((diary) => ({
    id: diary.id,
    title: diary.title,
    content: diary.content,
    author: diary.profiles?.nickname || diary.profiles?.name || '작성자',
    createdAt: formatDate(diary.created_at),
    isPublished: true, // 일기는 기본적으로 발행됨
    badges: [],
  }));

  return (
    <div className="space-y-6">
      {/* UniversalBoard 사용 */}
      <UniversalBoard
        title="성장 일기"
        description={`${cohort}기 수강생들의 성장 일기`}
        icon={<PencilSquareIcon className="w-6 h-6 text-green-600" />}
        iconBgColor="bg-green-100"
        createButtonText="일기 쓰기"
        items={boardItems}
        userRole={userRole}
        loading={loading}
        error={error || undefined}
        // 뷰 전환 기능
        showViewToggle={true}
        viewType={viewType}
        onViewTypeChange={setViewType}
        cardComponent={(props) => (
          <UniversalCardView
            {...props}
            config={{
              accentColor: 'green',
              gradientColors: { from: 'green-50', to: 'emerald-50' },
            }}
            renderBadges={(item) => [
              <div key="cohort" className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                <span className="text-xs font-medium text-green-700">{(item as GrowthDiary).cohort}기</span>
              </div>
            ]}
          />
        )}
        cardData={paginatedDiaries.map(diary => ({
          ...diary,
          author: diary.profiles?.nickname || diary.profiles?.name || '익명',
        }))}
        onCreateItem={() => setShowDiaryModal(true)}
        onViewItem={(item) => {
          const diary = diaries.find((d) => d.id === item.id);
          if (diary) handleViewDiary(diary);
        }}
        onEditItem={(item) => {
          const diary = diaries.find((d) => d.id === item.id);
          if (diary) {
            // 본인이 작성한 일기인지 확인
            const isMyDiary = currentUserId && diary.student_id === currentUserId;
            if ((userRole === 'student' && isMyDiary) || userRole === 'admin') {
              handleViewDiary(diary);
            }
          }
        }}
        onDeleteItem={(id) => {
          const diary = diaries.find((d) => d.id === id);
          if (diary) {
            // 본인이 작성한 일기인지 확인
            const isMyDiary = currentUserId && diary.student_id === currentUserId;
            if ((userRole === 'student' && isMyDiary) || userRole === 'admin') {
              if (userRole === 'student') {
                handleDeleteMyDiary(id);
              } else {
                handleAdminDelete(id);
              }
            }
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
      {diaries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageInfo={true}
        />
      )}

      {/* 일기 작성 모달 */}
      <UniversalCreateModal
        show={showDiaryModal}
        title="일기 쓰기"
        onClose={() => setShowDiaryModal(false)}
        onSubmit={async (formData) => {
          await handleCreateDiary(formData.title, formData.content);
        }}
        fields={[
          {
            name: 'title',
            type: 'text' as const,
            label: '일기 제목',
            required: true,
            maxLength: 100,
            placeholder: '일기 제목을 입력하세요',
          },
          {
            name: 'content',
            type: 'textarea' as const,
            label: '일기 내용',
            required: true,
            maxLength: 2000,
            placeholder: '오늘의 성장과 배운 점을 작성해보세요...',
            showCharacterCount: true,
          },
        ]}
      />

      {/* 일기 상세보기 모달 */}
      <UniversalDetailModal
        show={showDetailModal}
        item={selectedDiary}
        userRole={userRole}
        title="성장 일기 상세보기"
        editTitle="성장 일기 수정"
        onClose={() => setShowDetailModal(false)}
        onUpdate={async (id: string, formData: Record<string, any>) => {
          await handleEditDiary(id, formData.title, formData.content);
        }}
        fields={[
          {
            name: 'title',
            type: 'text' as const,
            label: '일기 제목',
            required: true,
            maxLength: 100,
          },
          {
            name: 'content',
            type: 'textarea' as const,
            label: '일기 내용',
            required: true,
            maxLength: 2000,
          },
        ]}
        renderHeader={(item) => (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                <span className="text-xs font-medium text-green-700">{(item as GrowthDiary).cohort}기</span>
              </div>
              <span className="text-sm text-slate-600">
                {(item as GrowthDiary).profiles?.nickname || (item as GrowthDiary).profiles?.name || '작성자'}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
}