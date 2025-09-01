'use client';

import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { GrowthDiary } from '@/types/domains/growthDiary';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DiaryDetailModalProps {
  show: boolean;
  diary: GrowthDiary | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onEditDiary?: (diaryId: string, title: string, content: string) => Promise<void>;
}

export default function DiaryDetailModal({
  show,
  diary,
  userRole,
  onClose,
  onEditDiary,
}: DiaryDetailModalProps) {
  // 현재 사용자 ID 상태
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 수정 모드 상태 관리
  const { form: editForm, updateForm, isEditing, startEdit, cancelEdit } = useFormState({
    title: '',
    content: '',
  });

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // 일기 수정 로직
  const { submitting: editSubmitting, submit: submitEdit } = useAsyncSubmit(async () => {
    if (!editForm.title.trim() || !editForm.content.trim() || !onEditDiary || !diary) return;
    await onEditDiary(diary.id, editForm.title, editForm.content);
    cancelEdit();
    onClose();
  });

  if (!diary) return null;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit();
  };

  const displayName = diary.profiles?.nickname || diary.profiles?.name || '익명';
  const createdAt = new Date(diary.created_at).toLocaleDateString();
  
  // 본인이 작성한 일기인지 확인
  const isMyDiary = currentUserId && diary.student_id === currentUserId;

  return (
    <Modal show={show} title='성장 일기 상세보기' onClose={onClose} size='2xl'>
      <div className='space-y-6'>
        {/* 일기 정보 */}
        <div>
          {isEditing ? (
            // 편집 모드
            <form onSubmit={handleEditSubmit}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>제목</label>
                  <input
                    type='text'
                    value={editForm.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>내용</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => updateForm({ content: e.target.value })}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[200px] resize-vertical'
                    required
                  />
                </div>
                <div className='flex justify-end space-x-3'>
                  <Button type='button' onClick={cancelEdit} variant='outline' disabled={editSubmitting}>
                    취소
                  </Button>
                  <Button type='submit' variant='primary' disabled={editSubmitting} isLoading={editSubmitting}>
                    {editSubmitting ? '저장중...' : '저장'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // 읽기 모드
            <>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-semibold text-slate-900'>{diary.title}</h3>
                <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                  <span className="text-xs font-medium text-green-700">{diary.cohort}기</span>
                </div>
              </div>

              <div className='text-sm text-slate-600 mb-4'>
                작성자: {displayName} | 작성일: {createdAt}
              </div>

              <div className='p-6 bg-slate-50 rounded-xl'>
                <p className='text-slate-800 whitespace-pre-wrap leading-relaxed'>{diary.content}</p>
              </div>
            </>
          )}
        </div>

        {/* 버튼 영역 - 편집 모드가 아닐 때만 표시 */}
        {!isEditing && (
          <div className='flex justify-between items-center pt-4 border-t border-slate-200'>
            <div>
              {/* 학생이고 본인이 작성한 일기면 수정 버튼 표시 */}
              {userRole === 'student' && onEditDiary && isMyDiary && (
                <Button
                  variant='outline'
                  onClick={() => startEdit({ title: diary.title, content: diary.content })}
                >
                  수정
                </Button>
              )}
            </div>
            <div>
              <Button onClick={onClose} variant='primary'>
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}