'use client';

import { Button } from '../Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // 표시할 페이지 번호들 계산
  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // 현재 페이지가 앞쪽이면 1-5 표시
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // 현재 페이지가 뒤쪽이면 마지막 5개 표시
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변 5개 표시
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center mt-6 gap-4'>
      {/* 페이지 정보 */}
      {showPageInfo && (
        <div className='text-sm text-slate-600'>
          페이지 {currentPage} / {totalPages}
        </div>
      )}

      {/* 페이지네이션 버튼들 */}
      <div className='flex items-center gap-2'>
        {/* 이전 버튼 */}
        <Button
          variant='outline'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-3 py-2'
        >
          이전
        </Button>

        {/* 페이지 번호 버튼들 */}
        {getVisiblePages().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? 'primary' : 'outline'}
            onClick={() => handlePageChange(pageNum)}
            className='px-3 py-2 min-w-[40px]'
          >
            {pageNum}
          </Button>
        ))}

        {/* 다음 버튼 */}
        <Button
          variant='outline'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='px-3 py-2'
        >
          다음
        </Button>
      </div>
    </div>
  );
}
