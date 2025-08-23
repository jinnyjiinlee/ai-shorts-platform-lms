import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ColumnFilters } from './types';

interface ColumnSearchProps {
  filters: ColumnFilters;
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
}

export default function ColumnSearch({
  filters,
  onSearchChange,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount
}: ColumnSearchProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* 검색 입력 */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="칼럼 제목이나 내용으로 검색..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 필터 및 정보 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <select
              value={filters.selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-slate-600">
            {filteredCount === totalCount ? (
              <span>총 {totalCount}개 칼럼</span>
            ) : (
              <span>{filteredCount}개 / 전체 {totalCount}개</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}