// 메인 칼럼 게시판 (UniversalBoard 사용)

'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useColumn } from '../hooks/useColumn';
import { Pagination } from '@/features/shared/ui/Pagination';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import ColumnCreateModal from './ColumnCreateModal';
import ColumnDetailModal from './ColumnDetailModal';
import { Badge } from '@/features/shared/ui/Badge';
import { markdownToPlainText } from '@/features/shared/ui/MarkdownRenderer';

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

    // 페이지네이션 관련
    paginatedColumns,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateColumn,
    handleDeleteColumn,
    handleEditColumn,
    handleViewColumn,
  } = useColumn(userRole);


  // Column을 BoardItem으로 변환 - 표준화된 boolean 패턴 사용
  const boardItems: BoardItem[] = paginatedColumns.map((column) => ({
    id: column.id,
    title: column.title,
    content: markdownToPlainText(column.content),
    author: column.author,
    createdAt: formatDate(column.created_at),
    isPinned: column.isFeatured,
    isPublished: column.isPublished,
    badges: [],
  }));

  return (
    <div className="space-y-6">

      {/* UniversalBoard 사용 */}
      <UniversalBoard
        title="칼럼"
        description={
          userRole === 'admin'
            ? '전문가의 노하우와 인사이트를 공유하세요'
            : '전문가들의 노하우와 인사이트를 만나보세요'
        }
        icon={<DocumentTextIcon className="w-6 h-6 text-purple-600" />}
        iconBgColor="bg-purple-100"
        createButtonText="새 칼럼 작성"
        items={boardItems}
        userRole={userRole}
        loading={loading}
        error={error || undefined}
        onCreateItem={() => setShowCreateModal(true)}
        onViewItem={(item) => {
          const column = columns.find((c) => c.id === item.id);
          if (column) handleViewColumn(column);
        }}
        onEditItem={(item) => {
          const column = columns.find((c) => c.id === item.id);
          if (column) handleViewColumn(column);
        }}
        onDeleteItem={(id) => handleDeleteColumn(id)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
              data.isPublished,
              data.isFeatured
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
      />
    </div>
  );
}