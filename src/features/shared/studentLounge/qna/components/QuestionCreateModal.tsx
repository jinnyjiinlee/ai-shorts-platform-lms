'use client';

import { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { InputField } from '@/features/shared/ui/InputField';
import { Button } from '@/features/shared/ui/Button';

interface QuestionCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (question: { title: string; content: string }) => Promise<void>;
}

export default function QuestionCreateModal({ show, onClose, onSubmit }: QuestionCreateModalProps) {
  const [form, setForm] = useState({
    title: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // 비동기 API 호출
      await onSubmit(form);
      
      // 성공시 폼 초기화 및 모달 닫기
      setForm({ title: '', content: '' });
      onClose();
    } catch (err) {
      console.error('질문 작성 실패:', err);
      setError('질문 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ title: '', content: '' }); // 폼 초기화
    setError(null); // 에러 초기화
    onClose();
  };

  return (
    <Modal show={show} title='새 질문 작성' onClose={handleClose} size='2xl'>
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
            onChange={(value) => setForm({ ...form, title: value })}
            placeholder='질문 제목을 입력하세요'
            required
          />

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>질문 내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder='질문 내용을 상세히 입력하세요...'
              className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2
  focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px] resize-vertical'
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
            {submitting ? '등록중...' : '질문 등록'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
