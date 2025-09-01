'use client';

import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';
import { useGrowthDiary } from '../hooks/useGrowthDiary';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import AdminContentCard from '@/components/admin/AdminContentCard';
import DiaryCreateModal from './DiaryCreateModal';
import DiaryDetailModal from './DiaryDetailModal';

import { Button } from '@/features/shared/ui/Button';
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

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600' />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return <div className='text-red-500 text-center p-4'>{error}</div>;
  }

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={<PencilSquareIcon className='w-6 h-6 text-slate-600' />}
        title='성장 일기'
        description={`${cohort}기 수강생들의 성장 일기`}
        actions={
          userRole === 'student' ? (
            <Button onClick={() => setShowDiaryModal(true)} variant='primary'>
              <PlusIcon className='w-4 h-4 mr-2' />
              일기 쓰기
            </Button>
          ) : null
        }
      />

      {/* 일기 목록 */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-slate-900'>성장 일기 목록</h2>
        </div>

        <div className='divide-y divide-slate-200'>
          {diaries.length === 0 ? (
            <div className='p-12 text-center'>
              <p className='text-slate-500 mb-4'>아직 작성된 성장 일기가 없습니다.</p>
              {userRole === 'student' && (
                <Button onClick={() => setShowDiaryModal(true)} variant='outline'>
                  첫 번째 성장 일기를 작성해보세요! ✏️
                </Button>
              )}
            </div>
          ) : (
            paginatedDiaries.map((diary) => {
              // 본인이 작성한 일기인지 확인
              const isMyDiary = currentUserId && diary.student_id === currentUserId;
              
              return (
                <AdminContentCard
                  key={diary.id}
                  title={diary.title}
                  content={diary.content}
                  cohort={cohort}
                  author={diary.profiles?.nickname || diary.profiles?.name || '작성자'}
                  createdAt={formatDate(diary.created_at)}
                  badges={[]}
                  onView={() => handleViewDiary(diary)}
                  // 학생이고 본인 일기이거나 관리자인 경우만 수정 가능
                  onEdit={(userRole === 'student' && isMyDiary) || userRole === 'admin' 
                    ? () => handleViewDiary(diary) 
                    : undefined}
                  // 학생이고 본인 일기이거나 관리자인 경우만 삭제 가능
                  onDelete={(userRole === 'student' && isMyDiary) || userRole === 'admin'
                    ? userRole === 'student'
                      ? () => handleDeleteMyDiary(diary.id)
                      : () => handleAdminDelete(diary.id)
                    : undefined
                  }
                />
              );
            })
          )}
        </div>
      </div>

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