// 공통 상세보기 모달 컴포넌트

'use client';

import { ReactNode } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';
import MarkdownRenderer from '@/features/shared/ui/MarkdownRenderer';

export interface DetailItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  badges?: ReactNode[];
}

export interface EditFormData {
  title: string;
  content: string;
  isPublished?: boolean;
  isPinned?: boolean;
  isFeatured?: boolean;
}

interface UniversalDetailModalProps {
  show: boolean;
  item: DetailItem | null;
  userRole: 'admin' | 'student';
  title: string;
  onClose: () => void;
  onEdit?: (itemId: string, formData: EditFormData) => Promise<void>;
  
  // 추가 설정 옵션들
  showPinned?: boolean;
  showFeatured?: boolean;
  pinnedLabel?: string;
  featuredLabel?: string;
  
  // 커스텀 렌더링
  customMetadata?: (item: DetailItem) => ReactNode;
  customBadges?: (item: DetailItem) => ReactNode[];
}

export default function UniversalDetailModal({
  show,
  item,
  userRole,
  title,
  onClose,
  onEdit,
  showPinned = true,
  showFeatured = false,
  pinnedLabel = "상단 고정",
  featuredLabel = "추천",
  customMetadata,
  customBadges
}: UniversalDetailModalProps) {
  const {
    form: editForm,
    updateForm,
    isEditing,
    startEdit,
    cancelEdit,
  } = useFormState({
    title: '',
    content: '',
    isPublished: false,
    isPinned: false,
    isFeatured: false,
  });

  // 수정 로직 (관리자만)
  const { submitting: editSubmitting, submit: submitEdit } = useAsyncSubmit(async () => {
    if (
      !editForm.title.trim() ||
      !editForm.content.trim() ||
      !onEdit ||
      !item ||
      userRole !== 'admin'
    )
      return;
    
    await onEdit(item.id, editForm);
    cancelEdit();
    onClose();
  });

  if (!item) return null;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBadges = () => {
    if (customBadges) return customBadges(item);
    
    const badges: ReactNode[] = [];
    
    if (item.isPinned && showPinned) {
      badges.push(
        <Badge key="pinned" variant="warning" size="sm">
          고정
        </Badge>
      );
    }
    
    if (item.isFeatured && showFeatured) {
      badges.push(
        <Badge key="featured" variant="warning" size="sm">
          추천
        </Badge>
      );
    }
    
    if (item.isPublished === false && userRole === 'admin') {
      badges.push(
        <Badge key="draft" variant="default" size="sm">
          임시저장
        </Badge>
      );
    }
    
    if (item.badges) {
      badges.push(...item.badges);
    }
    
    return badges;
  };

  return (
    <Modal show={show} title={`${title} 상세보기`} onClose={onClose} size="2xl">
      <div className="space-y-6">
        {/* 상세 정보 */}
        <div>
          {isEditing && userRole === 'admin' ? (
            // 편집 모드 (관리자만)
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    내용
                  </label>
                  <MarkdownEditor
                    value={editForm.content}
                    onChange={(value: string) => updateForm({ content: value })}
                    placeholder="마크다운으로 내용을 수정하세요!"
                    className="min-h-[200px]"
                  />
                </div>

                {/* 설정 옵션들 - 작성 모달과 동일한 UI */}
                <div className="space-y-4">
                  {/* 즉시 발행 토글 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div>
                        <label htmlFor="editIsPublished" className="text-sm font-semibold text-blue-800 cursor-pointer">
                          즉시 발행
                        </label>
                        <p className="text-xs text-blue-600 mt-0.5">
                          체크 해제시 임시저장됩니다
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="editIsPublished"
                        checked={editForm.isPublished}
                        onChange={(e) => updateForm({ isPublished: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* 상단 고정 토글 */}
                  {showPinned && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </div>
                        <div>
                          <label htmlFor="editIsPinned" className="text-sm font-semibold text-amber-800 cursor-pointer">
                            {pinnedLabel}
                          </label>
                          <p className="text-xs text-amber-600 mt-0.5">
                            중요한 글을 맨 위에 고정합니다
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="editIsPinned"
                          checked={editForm.isPinned}
                          onChange={(e) => updateForm({ isPinned: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  )}

                  {/* 추천 토글 */}
                  {showFeatured && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div>
                          <label htmlFor="editIsFeatured" className="text-sm font-semibold text-purple-800 cursor-pointer">
                            {featuredLabel}
                          </label>
                          <p className="text-xs text-purple-600 mt-0.5">
                            우수한 글을 추천으로 표시합니다
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="editIsFeatured"
                          checked={editForm.isFeatured}
                          onChange={(e) => updateForm({ isFeatured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" onClick={cancelEdit} variant="outline" disabled={editSubmitting}>
                    취소
                  </Button>
                  <Button type="submit" variant="primary" disabled={editSubmitting} isLoading={editSubmitting}>
                    저장
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // 읽기 모드
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.isPinned && showPinned ? '📌 ' : ''}
                    {item.isFeatured && showFeatured ? '⭐ ' : ''}
                    {item.title}
                  </h3>
                  
                  {/* 배지들 */}
                  <div className="flex items-center space-x-2">
                    {getBadges().map((badge, index) => (
                      <span key={index}>{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 메타데이터 */}
              <div className="text-sm text-slate-600 mb-4">
                {customMetadata ? customMetadata(item) : (
                  <>작성자: {item.author} | 작성일: {formatDate(item.createdAt)}</>
                )}
              </div>

              {/* 내용 */}
              <div className="p-6 bg-slate-50 rounded-xl">
                <MarkdownRenderer 
                  content={item.content} 
                  className="text-slate-800"
                />
              </div>
            </>
          )}
        </div>

        {/* 버튼 영역 - 편집 모드가 아닐 때만 표시 */}
        {!isEditing && (
          <div className="flex justify-end items-center space-x-3 pt-4 border-t border-slate-200">
            {/* 관리자만 수정 버튼 표시 */}
            {userRole === 'admin' && onEdit && (
              <Button
                variant="outline"
                onClick={() =>
                  startEdit({
                    title: item.title,
                    content: item.content,
                    isPublished: item.isPublished ?? true,
                    isPinned: item.isPinned ?? false,
                    isFeatured: item.isFeatured ?? false,
                  })
                }
              >
                편집
              </Button>
            )}
            
            <Button onClick={onClose} variant="primary">
              닫기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}