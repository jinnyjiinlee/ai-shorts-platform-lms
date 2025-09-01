'use client';

import { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { InputField } from '@/features/shared/ui/InputField';
import { Button } from '@/features/shared/ui/Button';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';

interface DiaryCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (diary: { title: string; content: string }) => Promise<void>;
}

export default function DiaryCreateModal({ show, onClose, onSubmit }: DiaryCreateModalProps) {
  const { form, updateForm, resetForm } = useFormState({
    title: '',
    content: '',
  });
  
  const [error, setError] = useState<string | null>(null);

  const { submitting, submit } = useAsyncSubmit(async () => {
    // 유효성 검사
    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setError(null);
    await onSubmit(form);
    resetForm();
    onClose();
  }, {
    onError: (err) => {
      console.error('일기 작성 실패:', err);
      setError('일기 작성에 실패했습니다. 다시 시도해주세요.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleClose = () => {
    resetForm();
    setError(null);
    onClose();
  };

  return (
    <Modal show={show} title='새 성장 일기 작성' onClose={handleClose} size='2xl'>
      <form onSubmit={handleSubmit}>
        {/* 에러 메시지 표시 */}
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
            {error}
          </div>
        )}
        
        <div className='space-y-6'>
          <InputField
            label='제목'
            value={form.title}
            onChange={(value) => updateForm({ title: value })}
            placeholder='오늘의 성장을 한 줄로 요약해보세요'
            required
          />

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>일기 내용</label>
            <textarea
              value={form.content}
              onChange={(e) => updateForm({ content: e.target.value })}
              placeholder='오늘 무엇을 배웠나요? 어떤 성장을 했나요?'
              className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[200px] resize-vertical'
              required
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200'>
          <Button 
            type='button' 
            onClick={handleClose} 
            variant='outline'
            disabled={submitting}
          >
            취소
          </Button>
          <Button 
            type='submit' 
            variant='primary'
            disabled={submitting}
            isLoading={submitting}
          >
            {submitting ? '작성중...' : '일기 작성'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}