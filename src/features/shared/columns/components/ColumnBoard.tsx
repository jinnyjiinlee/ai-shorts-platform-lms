// 메인 칼럼 게시판

'use client';

import { PlusIcon, DocumentTextIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useColumn } from '../hooks/useColumn';
import { Pagination } from '@/features/shared/ui/Pagination';
import ColumnCard from './ColumnCard';
import ColumnCreateModal from './ColumnCreateModal';
import ColumnDetailModal from './ColumnDetailModal';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { Select } from '@/features/shared/ui/Select';

interface ColumnBoardProps {
  userRole: 'admin' | 'student';
}

export default function ColumnBoard({ userRole }: ColumnBoardProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const {
    columns,
    loading,
    error,
    showCreateModal,
    setShowCreateModal,
    showDetailModal,
    selectedColumn,
    setShowDetailModal,
    selectedCohort,

    // 페이지네이션 관련
    paginatedColumns,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateColumn,
    handleDeleteColumn,
    handleEditColumn,
    handleViewColumn,
    handleToggleLike,
    handleCohortChange,
  } = useColumn(userRole);

  const availableCohorts = ['1', '2', '3'];

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600' />
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
          <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
            <DocumentTextIcon className='w-6 h-6 text-purple-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>칼럼</h1>
            <p className='text-slate-600'>
              {userRole === 'admin' ? '전문가의 노하우와 인사이트를 공유하세요' : '전문가들의 노하우와 인사이트를 만나보세요'}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          {/* 기수 필터 */}
          <Select
            value={selectedCohort}
            onChange={handleCohortChange}
            options={[
              { value: 'all', label: '전체' },
              ...availableCohorts.map((cohort) => ({ value: cohort, label: `${cohort}기` })),
            ]}
            className='w-32'
          />

          {userRole === 'admin' && (
            <Button onClick={() => setShowCreateModal(true)} variant='primary' className='flex items-center space-x-2'>
              <PlusIcon className='w-4 h-4' />
              <span>새 칼럼 작성</span>
            </Button>
          )}
        </div>
      </div>

      {/* 칼럼 목록 */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {selectedCohort === 'all' ? '전체' : `${selectedCohort}기`} 칼럼 목록
          </h2>
        </div>

        {paginatedColumns.length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <DocumentTextIcon className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p className='text-lg mb-2'>
              {userRole === 'admin' ? '아직 작성된 칼럼이 없습니다.' : '현재 칼럼이 없습니다.'}
            </p>
            {userRole === 'admin' && (
              <Button onClick={() => setShowCreateModal(true)} variant='primary' className='mt-4'>
                첫 번째 칼럼 작성하기
              </Button>
            )}
          </div>
        ) : userRole === 'student' ? (
          // 학생용 - 카드 형태로 표시
          <div className='p-6'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {paginatedColumns.map((column) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  onView={() => handleViewColumn(column)}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>
          </div>
        ) : (
          // 관리자용 - 리스트 형태로 표시
          <div className='divide-y divide-slate-200'>
            {paginatedColumns.map((column) => (
              <div key={column.id} className='p-6 hover:bg-slate-50 transition-colors'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <h3 
                        className='text-lg font-semibold text-slate-900 cursor-pointer hover:text-purple-600 transition-colors'
                        onClick={() => handleViewColumn(column)}
                      >
                        {column.title}
                      </h3>
                      <div className='flex items-center space-x-1'>
                        {column.is_featured && (
                          <Badge variant='warning' size='sm'>추천</Badge>
                        )}
                        <Badge 
                          variant={column.status === 'published' ? 'success' : column.status === 'draft' ? 'default' : 'danger'} 
                          size='sm'
                        >
                          {column.status === 'published' ? '발행' : column.status === 'draft' ? '임시저장' : '보관'}
                        </Badge>
                      </div>
                    </div>
                    
                    {column.summary && (
                      <p className='text-sm text-slate-600 mb-2 line-clamp-2'>{column.summary}</p>
                    )}
                    
                    <div className='flex items-center space-x-4 text-sm text-slate-500'>
                      <span>{column.author}</span>
                      <span>{column.cohort}기</span>
                      <span>{formatDate(column.created_at)}</span>
                      <div className='flex items-center space-x-1'>
                        <EyeIcon className='w-4 h-4' />
                        <span>{column.view_count || 0}</span>
                      </div>
                      <div className='flex items-center space-x-1'>
                        <HeartIcon className='w-4 h-4' />
                        <span>{column.like_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex items-center space-x-2 ml-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewColumn(column)}
                    >
                      보기
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewColumn(column)}
                    >
                      수정
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteColumn(column.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
      {columns.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageInfo={true}
        />
      )}

      {/* 칼럼 작성 모달 (관리자만) */}
      {userRole === 'admin' && (
        <ColumnCreateModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await handleCreateColumn(
              data.title,
              data.content,
              data.summary,
              data.cohort,
              data.status,
              data.isFeatured,
              data.thumbnailUrl,
              data.metaDescription
            );
          }}
        />
      )}

      {/* 칼럼 상세보기 모달 */}
      <ColumnDetailModal
        show={showDetailModal}
        column={selectedColumn}
        userRole={userRole}
        onClose={() => setShowDetailModal(false)}
        onEditColumn={handleEditColumn}
        onToggleLike={handleToggleLike}
      />
    </div>
  );
}