'use client';

import { useGrowthDiary } from '../hooks/useGrowthDiary';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import DiaryCreateModal from './DiaryCreateModal';
import DiaryDetailModal from './DiaryDetailModal';
import { Pagination } from '@/features/shared/ui/Pagination';

interface GrowthDiaryBoardProps {
  userRole: 'admin' | 'student';
  cohort: string;
}

export default function GrowthDiaryBoard({ userRole, cohort }: GrowthDiaryBoardProps) {
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
        onCreateItem={userRole === 'student' ? () => setShowDiaryModal(true) : undefined}
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
      <DiaryCreateModal
        show={showDiaryModal}
        onClose={() => setShowDiaryModal(false)}
        onSubmit={async (data) => {
          await handleCreateDiary(data.title, data.content);
        }}
      />

      {/* 일기 상세보기 모달 */}
      <DiaryDetailModal
        show={showDetailModal}
        diary={selectedDiary}
        userRole={userRole}
        onClose={() => setShowDetailModal(false)}
        onEditDiary={handleEditDiary}
      />
    </div>
  );
}