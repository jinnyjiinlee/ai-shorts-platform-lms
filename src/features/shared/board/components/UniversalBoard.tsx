'use client';

import { ReactNode } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';

export interface BoardItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned?: boolean;
  isPublished?: boolean;
  badges?: ReactNode[];
}

// 필터 옵션 타입 정의
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

interface UniversalBoardProps {
  title: string;
  description: string;
  icon: ReactNode;
  items: BoardItem[];
  userRole: 'admin' | 'student';
  loading?: boolean;
  error?: string;
  
  // 스타일링 옵션
  iconBgColor?: string; // 아이콘 배경색 커스터마이징
  createButtonText?: string; // 버튼 텍스트 커스터마이징
  
  // 필터 관련 props
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  
  // 액션 함수들
  onCreateItem?: () => void;
  onViewItem?: (item: BoardItem) => void;
  onEditItem?: (item: BoardItem) => void;
  onDeleteItem?: (id: string) => void;
  onTogglePinned?: (id: string) => void;
  onTogglePublished?: (id: string) => void;
  
  // 사용자 정의 액션들
  extraActions?: (item: BoardItem) => ReactNode[];
  
  // 페이지네이션
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function UniversalBoard({
  title,
  description,
  icon,
  items,
  userRole,
  loading = false,
  error,
  iconBgColor = "bg-blue-100",
  createButtonText = "새 글 작성",
  filterOptions,
  selectedFilter,
  onFilterChange,
  onCreateItem,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onTogglePinned,
  onTogglePublished,
  extraActions,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: UniversalBoardProps) {
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-2">오류가 발생했습니다</div>
        <div className="text-sm text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-600">{description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* 필터 옵션들 */}
          {filterOptions && onFilterChange && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <Badge
                  key={filter.value}
                  variant={filter.variant || 'default'}
                  size="sm"
                  selectable={true}
                  selected={selectedFilter === filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className="transition-all hover:shadow-sm cursor-pointer"
                >
                  {filter.label}
                  {filter.count !== undefined && ` (${filter.count})`}
                </Badge>
              ))}
            </div>
          )}

          {/* 생성 버튼 */}
          {((userRole === 'admin') || (userRole === 'student' && onCreateItem)) && onCreateItem && (
            <Button
              onClick={onCreateItem}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>{createButtonText}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 아이템 목록 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {items.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              {icon}
            </div>
            <p className="text-lg mb-2">
              {userRole === 'admin' 
                ? '아직 작성된 글이 없습니다.' 
                : '현재 글이 없습니다.'
              }
            </p>
            {userRole === 'admin' && onCreateItem && (
              <Button
                onClick={onCreateItem}
                variant="primary"
                className="mt-4"
              >
                첫 번째 글 작성하기
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.isPinned && '📌 '}{item.title}
                      </h3>
                      
                      {/* 배지들 */}
                      {item.badges?.map((badge, index) => (
                        <span key={index}>{badge}</span>
                      ))}
                      
                      {/* 기본 배지들 */}
                      {item.isPinned && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          고정
                        </span>
                      )}
                      {item.isPublished === false && userRole === 'admin' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          초안
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-3 line-clamp-2">{item.content}</p>

                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <span>👤 {item.author}</span>
                      <span>📅 {item.createdAt}</span>
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center space-x-2">
                    {onViewItem && (
                      <button
                        onClick={() => onViewItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="상세보기"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}

                    {userRole === 'admin' && onEditItem && (
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {/* 추가 액션들 */}
                    {extraActions && extraActions(item).map((action, index) => (
                      <span key={index}>{action}</span>
                    ))}

                    {userRole === 'admin' && onDeleteItem && (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}