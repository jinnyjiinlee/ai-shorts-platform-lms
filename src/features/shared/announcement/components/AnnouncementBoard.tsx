// 메인 게시판 (기존 community와 동일 )

'use client';

import { PlusIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { Pagination } from '@/features/shared/ui/Pagination';
import AdminContentCard from '@/components/admin/AdminContentCard';
import AnnouncementCreateModal from './AnnouncementCreateModal';
import AnnouncementDetailModal from './AnnouncementDetailModal';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { markdownToPlainText } from '@/features/shared/ui/MarkdownRenderer';

interface AnnouncementBoardProps {
  userRole: 'admin' | 'student';
}

export default function AnnouncementBoard({ userRole }: AnnouncementBoardProps) {
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

  const {
    announcements,
    loading,
    error,
    showCreateModal,
    setShowCreateModal,
    showDetailModal,
    selectedAnnouncement,
    setShowDetailModal,

    // 페이지네이션 관련
    paginatedAnnouncements,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleEditAnnouncement,
    handleViewAnnouncement,
  } = useAnnouncement(userRole);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div
          className='animate-spin rounded-full h-8 w-8 border-b-2 
  border-blue-600'
        />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return <div className='text-red-500 text-center p-4'>{error}</div>;
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <MegaphoneIcon className='w-6 h-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>공지사항</h1>
            <p className='text-slate-600'>
              {userRole === 'admin' ? '중요한 공지사항을 작성하고 관리하세요' : '중요한 공지사항을 확인하세요'}
            </p>
          </div>
        </div>

        {userRole === 'admin' && (
          <Button onClick={() => setShowCreateModal(true)} variant='primary' className='flex items-center space-x-2'>
            <PlusIcon className='w-4 h-4' />
            <span>새 공지 작성</span>
          </Button>
        )}
      </div>

      {/* 공지사항 목록 */}
      <div
        className='bg-white rounded-xl border border-slate-200 
  shadow-sm'
      >
        <div
          className='p-6 border-b border-slate-200 flex items-center 
  justify-between'
        >
          <h2 className='text-xl font-semibold text-slate-900'>공지사항 목록</h2>
        </div>

        {paginatedAnnouncements.length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <MegaphoneIcon className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p className='text-lg mb-2'>
              {userRole === 'admin' ? '아직 작성된 공지사항이 없습니다.' : '현재 공지사항이 없습니다.'}
            </p>
            {userRole === 'admin' && (
              <Button onClick={() => setShowCreateModal(true)} variant='primary' className='mt-4'>
                첫 번째 공지사항 작성하기
              </Button>
            )}
          </div>
        ) : (
          <div className='divide-y divide-slate-200'>
            {paginatedAnnouncements.map((announcement) => (
              <AdminContentCard
                key={announcement.id}
                title={`${announcement.is_pinned ? '📌 ' : ''}${announcement.title}`}
                content={markdownToPlainText(announcement.content)}
                cohort='all'
                author={announcement.profiles?.nickname || '관리자'}
                createdAt={formatDate(announcement.created_at)}
                badges={[
                  announcement.is_pinned && (
                    <Badge key='pinned' variant='warning' size='sm'>
                      고정
                    </Badge>
                  ),
                  !announcement.is_published && (
                    <Badge key='draft' variant='default' size='sm'>
                      임시저장
                    </Badge>
                  ),
                ].filter(Boolean)}
                onView={() => handleViewAnnouncement(announcement)}
                // 관리자만 수정/삭제 가능
                onEdit={userRole === 'admin' ? () => handleViewAnnouncement(announcement) : undefined}
                onDelete={userRole === 'admin' ? () => handleDeleteAnnouncement(announcement.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
      {announcements.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageInfo={true}
        />
      )}

      {/* 공지 작성 모달 (관리자만) */}
      {userRole === 'admin' && (
        <AnnouncementCreateModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await handleCreateAnnouncement(data.title, data.content, data.isPublished, data.isPinned);
          }}
        />
      )}

      {/* 공지 상세보기 모달 */}
      <AnnouncementDetailModal
        show={showDetailModal}
        announcement={selectedAnnouncement}
        userRole={userRole}
        onClose={() => setShowDetailModal(false)}
        onEditAnnouncement={handleEditAnnouncement}
      />
    </div>
  );
}
