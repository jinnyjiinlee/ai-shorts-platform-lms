// 공지 작성 모달

'use client';

import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';

interface AnnouncementCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; isPublished: boolean; isPinned: boolean }) => Promise<void>;
}

export default function AnnouncementCreateModal({ show, onClose, onSubmit }: AnnouncementCreateModalProps) {
  const { form, updateForm, resetForm } = useFormState({
    title: '',
    content: '',
    isPublished: true,
    isPinned: false,
  });

  const { submitting, submit } = useAsyncSubmit(async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    await onSubmit(form);
    resetForm();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <Modal show={show} title='새 공지사항 작성' onClose={onClose} size='2xl'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6'>
          <div>
            <label
              className='block text-sm font-medium text-slate-700 
  mb-2'
            >
              제목
            </label>
            <input
              type='text'
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className='w-full px-4 py-3 border border-slate-300
  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-all'
              placeholder='공지사항 제목을 입력하세요'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              내용
            </label>
            <MarkdownEditor
              value={form.content}
              onChange={(value: string) => updateForm({ content: value })}
              placeholder="마크다운으로 공지사항 내용을 작성하세요!"
              className="min-h-[300px]"
            />
          </div>

          {/* 설정 옵션 */}
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
                  <label htmlFor="isPublished" className="text-sm font-semibold text-blue-800 cursor-pointer">
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
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => updateForm({ isPublished: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* 상단 고정 토글 */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div>
                  <label htmlFor="isPinned" className="text-sm font-semibold text-amber-800 cursor-pointer">
                    상단 고정
                  </label>
                  <p className="text-xs text-amber-600 mt-0.5">
                    중요한 공지를 맨 위에 고정합니다
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => updateForm({ isPinned: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div
          className='flex justify-end space-x-3 pt-6 border-t 
  border-slate-200 mt-6'
        >
          <Button type='button' onClick={onClose} variant='outline' disabled={submitting}>
            취소
          </Button>
          <Button type='submit' variant='primary' disabled={submitting} isLoading={submitting}>
            {submitting ? '작성중...' : '작성 완료'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
