// 칼럼 작성 모달

'use client';

import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { Select } from '@/features/shared/ui/Select';
import { InputField } from '@/features/shared/ui/InputField';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { useFormState } from '@/features/shared/hooks/useFormState';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';

interface ColumnCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    summary?: string;
    cohort: string;
    status: 'draft' | 'published';
    isFeatured: boolean;
    thumbnailUrl?: string;
    metaDescription?: string;
  }) => Promise<void>;
}

export default function ColumnCreateModal({ show, onClose, onSubmit }: ColumnCreateModalProps) {
  const { form, updateForm, resetForm } = useFormState({
    title: '',
    content: '',
    summary: '',
    cohort: '1',
    status: 'published' as 'draft' | 'published',
    isFeatured: false,
    thumbnailUrl: '',
    metaDescription: '',
  });

  const availableCohorts = ['1', '2', '3'];

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
    <Modal show={show} title='새 칼럼 작성' onClose={onClose} size='4xl'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6'>
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <InputField
                label="칼럼 제목"
                value={form.title}
                onChange={(value: string) => updateForm({ title: value })}
                placeholder="칼럼 제목을 입력하세요"
                required
              />
            </div>

            <div>
              <Select
                label="대상 기수"
                value={form.cohort}
                onChange={(value) => updateForm({ cohort: value })}
                options={availableCohorts.map((cohort) => ({ value: cohort, label: `${cohort}기` }))}
              />
            </div>

            <div>
              <Select
                label="발행 상태"
                value={form.status}
                onChange={(value) => updateForm({ status: value as 'draft' | 'published' })}
                options={[
                  { value: 'draft', label: '임시저장' },
                  { value: 'published', label: '즉시 발행' },
                ]}
              />
            </div>
          </div>

          {/* 요약 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              칼럼 요약 (선택사항)
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => updateForm({ summary: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="칼럼의 핵심 내용을 간단히 요약해주세요 (카드에서 미리보기로 사용됩니다)"
              rows={3}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              칼럼 내용
            </label>
            <MarkdownEditor
              value={form.content}
              onChange={(value: string) => updateForm({ content: value })}
              placeholder="마크다운으로 칼럼 내용을 작성하세요!"
              className="min-h-[400px]"
            />
          </div>

          {/* SEO 및 미디어 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <InputField
                label="썸네일 URL (선택사항)"
                value={form.thumbnailUrl}
                onChange={(value: string) => updateForm({ thumbnailUrl: value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <InputField
                label="SEO 설명 (선택사항)"
                value={form.metaDescription}
                onChange={(value: string) => updateForm({ metaDescription: value })}
                placeholder="검색 결과에 표시될 설명을 입력하세요"
              />
            </div>
          </div>

          {/* 옵션 */}
          <div className="space-y-4">
            {/* 추천 칼럼 토글 */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <label htmlFor="isFeatured" className="text-sm font-semibold text-purple-800 cursor-pointer">
                    추천 칼럼으로 설정
                  </label>
                  <p className="text-xs text-purple-600 mt-0.5">
                    메인 페이지에서 우선적으로 노출됩니다
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => updateForm({ isFeatured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-6'>
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