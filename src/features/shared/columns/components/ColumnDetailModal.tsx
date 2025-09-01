// 칼럼 상세보기 모달

'use client';

import { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { EyeIcon, HeartIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import MarkdownRenderer from '@/features/shared/ui/MarkdownRenderer';
import { Column } from '@/types/domains/community';

interface ColumnDetailModalProps {
  show: boolean;
  column: Column | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onEditColumn?: (columnId: string, updates: any) => Promise<void>;
  onToggleLike: (columnId: string) => Promise<boolean | undefined>;
}

export default function ColumnDetailModal({
  show,
  column,
  userRole,
  onClose,
  onEditColumn,
  onToggleLike
}: ColumnDetailModalProps) {
  const [isLiking, setIsLiking] = useState(false);

  if (!column) return null;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onToggleLike(column.id);
    } finally {
      setIsLiking(false);
    }
  };

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

  const formatReadingTime = (content: string) => {
    const chars = content.replace(/\s/g, '').length;
    const minutes = Math.ceil(chars / 300);
    return `${minutes}분`;
  };

  return (
    <Modal show={show} title="" onClose={onClose} size='4xl'>
      <div className="space-y-6">
        {/* 헤더 - 메타 정보 */}
        <div className="pb-4 border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{column.author}</h3>
                <div className="flex items-center space-x-3 text-sm text-slate-500 mt-1">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(column.published_at || column.created_at)}</span>
                  </div>
                  <span>•</span>
                  <span>{formatReadingTime(column.content)} 읽기</span>
                  <span>•</span>
                  <span>{column.cohort}기</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {column.is_featured && (
                <Badge variant="warning" size="sm">추천</Badge>
              )}
              {userRole === 'admin' && (
                <Badge 
                  variant={column.status === 'published' ? 'success' : column.status === 'draft' ? 'default' : 'danger'} 
                  size="sm"
                >
                  {column.status === 'published' ? '발행' : column.status === 'draft' ? '임시저장' : '보관'}
                </Badge>
              )}
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{column.title}</h1>

          {/* 요약 (있을 경우) */}
          {column.summary && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-slate-700 leading-relaxed">{column.summary}</p>
            </div>
          )}

          {/* 통계 */}
          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4" />
              <span>{column.view_count || 0}회 조회</span>
            </div>
            <div className="flex items-center space-x-1">
              <HeartIcon className="w-4 h-4" />
              <span>{column.like_count || 0}개 좋아요</span>
            </div>
          </div>
        </div>

        {/* 썸네일 (있을 경우) */}
        {column.thumbnail_url && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={column.thumbnail_url} 
              alt={column.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* 내용 */}
        <div className="prose prose-slate max-w-none">
          <MarkdownRenderer content={column.content} />
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            {userRole === 'student' && (
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  column.isLiked
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {column.isLiked ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {column.isLiked ? '좋아요 취소' : '좋아요'}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {userRole === 'admin' && onEditColumn && (
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: 편집 모달 열기 또는 편집 페이지로 이동
                  console.log('Edit column:', column.id);
                }}
              >
                편집
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}