'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '../../../lib/hooks/common/useDebounce';
import { BookOpenIcon } from '@heroicons/react/24/outline';

// 컴포넌트 임포트
import ColumnSearch from './ColumnSearch';
import SimpleColumnCard from './SimpleColumnCard';
import ColumnDetail from './ColumnDetail';

// 타입 및 데이터 임포트
import { Column, ColumnFilters } from './types';
import { mockColumns } from './mockData';

export default function ColumnView() {
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [columns, setColumns] = useState<Column[]>(mockColumns);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filters: ColumnFilters = {
    searchTerm: debouncedSearchTerm,
    selectedCategory
  };

  // 필터링된 칼럼 목록
  const filteredColumns = useMemo(() => {
    return columns.filter(column => {
      const matchesSearch = column.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           column.summary.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           column.content.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           column.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const matchesCategory = filters.selectedCategory === 'all' || column.category === filters.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [columns, filters]);

  // 카테고리 목록
  const categories = useMemo(() => {
    return Array.from(new Set(columns.map(column => column.category)));
  }, [columns]);

  // 좋아요 토글
  const handleLike = (columnId: number) => {
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { 
              ...column, 
              isLiked: !column.isLiked,
              likes: column.isLiked ? column.likes - 1 : column.likes + 1
            }
          : column
      )
    );
  };

  // 칼럼 상세보기
  const handleColumnClick = (column: Column) => {
    setSelectedColumn(column);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedColumn(null);
  };

  // 상세보기 모드
  if (selectedColumn) {
    return (
      <ColumnDetail
        column={selectedColumn}
        onBack={handleBackToList}
        onLike={() => handleLike(selectedColumn.id)}
      />
    );
  }

  // 목록보기 모드
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">하대표 칼럼</h1>
            <p className="text-blue-100 text-sm sm:text-lg">
              유튜브 성장과 크리에이터 노하우를 공유합니다
            </p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <ColumnSearch
        filters={filters}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        totalCount={columns.length}
        filteredCount={filteredColumns.length}
      />

      {/* 칼럼 목록 */}
      <div className="space-y-6">
        {filteredColumns.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-slate-600">
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredColumns.map((column) => (
              <SimpleColumnCard
                key={column.id}
                column={column}
                onSelect={setSelectedColumn}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}