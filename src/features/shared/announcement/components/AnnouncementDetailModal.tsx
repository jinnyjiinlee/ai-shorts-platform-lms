// 공지 상세 / 수정 모달

'use client';

import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { Announcement } from '@/types/domains/announcement';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';
import MarkdownRenderer from '@/features/shared/ui/MarkdownRenderer';

interface AnnouncementDetailModalProps {
  show: boolean;
  announcement: Announcement | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onEditAnnouncement?: (
    announcementId: string,
    title: string,
    content: string,
    isPublished?: boolean,
    isPinned?: boolean
  ) => Promise<void>;
}

export default function AnnouncementDetailModal({
  show,
  announcement,
  userRole,
  onClose,
  onEditAnnouncement,
}: AnnouncementDetailModalProps) {
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
  });

  // 공지사항 수정 로직 (관리자만)
  const { submitting: editSubmitting, submit: submitEdit } = useAsyncSubmit(async () => {
    if (
      !editForm.title.trim() ||
      !editForm.content.trim() ||
      !onEditAnnouncement ||
      !announcement ||
      userRole !== 'admin'
    )
      return;
    await onEditAnnouncement(
      announcement.id,
      editForm.title,
      editForm.content,
      editForm.isPublished,
      editForm.isPinned
    );
    cancelEdit();
    onClose();
  });

  if (!announcement) return null;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit();
  };

  const displayName = announcement.profiles?.nickname || '관리자';
  const createdAt = new Date(announcement.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal show={show} title='공지사항 상세보기' onClose={onClose} size='2xl'>
      <div className='space-y-6'>
        {/* 공지사항 정보 */}
        <div>
          {isEditing && userRole === 'admin' ? (
            // 편집 모드 (관리자만)
            <form onSubmit={handleEditSubmit}>
              <div className='space-y-4'>
                <div>
                  <label
                    className='block text-sm font-medium 
  text-slate-700 mb-2'
                  >
                    제목
                  </label>
                  <input
                    type='text'
                    value={editForm.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    내용
                  </label>
                  <MarkdownEditor
                    value={editForm.content}
                    onChange={(value: string) => updateForm({ content: value })}
                    placeholder="마크다운으로 공지사항 내용을 수정하세요!"
                    className="min-h-[200px]"
                  />
                </div>

                <div className='flex items-center space-x-6'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='editIsPublished'
                      checked={editForm.isPublished}
                      onChange={(e) => updateForm({ isPublished: e.target.checked })}
                      className='rounded border-slate-300'
                    />
                    <label
                      htmlFor='editIsPublished'
                      className='ml-2 
  text-sm text-slate-700'
                    >
                      발행
                    </label>
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='editIsPinned'
                      checked={editForm.isPinned}
                      onChange={(e) => updateForm({ isPinned: e.target.checked })}
                      className='rounded border-slate-300'
                    />
                    <label
                      htmlFor='editIsPinned'
                      className='ml-2 text-sm 
  text-slate-700'
                    >
                      상단 고정
                    </label>
                  </div>
                </div>

                <div className='flex justify-end space-x-3'>
                  <Button type='button' onClick={cancelEdit} variant='outline' disabled={editSubmitting}>
                    취소
                  </Button>
                  <Button type='submit' variant='primary' disabled={editSubmitting} isLoading={editSubmitting}>
                    저장
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // 읽기 모드
            <>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-3'>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    {announcement.is_pinned ? '📌 ' : ''}
                    {announcement.title}
                  </h3>
                  {announcement.is_pinned && (
                    <span
                      className='px-2 py-1 bg-yellow-100 
  text-yellow-800 rounded-full text-xs'
                    >
                      고정
                    </span>
                  )}
                  {!announcement.is_published && (
                    <span
                      className='px-2 py-1 bg-slate-100 text-slate-600 
  rounded-full text-xs'
                    >
                      임시저장
                    </span>
                  )}
                </div>
              </div>

              <div className='text-sm text-slate-600 mb-4'>
                작성자: {displayName} | 작성일: {createdAt}
              </div>

              <div className='p-6 bg-slate-50 rounded-xl'>
                <MarkdownRenderer 
                  content={announcement.content} 
                  className="text-slate-800"
                />
              </div>
            </>
          )}
        </div>

        {/* 버튼 영역 - 편집 모드가 아닐 때만 표시 */}
        {!isEditing && (
          <div
            className='flex justify-between items-center pt-4 border-t 
  border-slate-200'
          >
            <div>
              {/* 관리자만 수정 버튼 표시 */}
              {userRole === 'admin' && onEditAnnouncement && (
                <Button
                  variant='outline'
                  onClick={() =>
                    startEdit({
                      title: announcement.title,
                      content: announcement.content,
                      isPublished: announcement.is_published,
                      isPinned: announcement.is_pinned,
                    })
                  }
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
