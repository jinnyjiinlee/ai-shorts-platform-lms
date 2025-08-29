'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from './MarkdownEditor';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import { Badge } from '@/features/shared/ui/Badge';
import { Select } from '@/features/shared/ui/Select';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import AdminContentCard from '@/components/admin/AdminContentCard';
import { useModal } from '@/features/shared/hooks/useModal';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { Column } from '@/types/domains/community';

export default function ColumnsManagement() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string | 'all'>('all');

  const modal = useModal<Column>();
  const { form, updateForm, resetForm, startEdit } = useFormState({
    title: '',
    content: '',
    cohort: '1',
    isPublished: true,
  });

  const availableCohorts = ['1', '2', '3'];

  const { submitting, submit } = useAsyncSubmit(async () => {
    const newColumn: Column = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      author: '하대표',
    };

    if (modal.selectedItem) {
      setColumns(
        columns.map((col) => (col.id === modal.selectedItem!.id ? { ...newColumn, id: modal.selectedItem!.id } : col))
      );
    } else {
      setColumns([newColumn, ...columns]);
    }

    resetForm();
    modal.closeModal();
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    submit();
  };

  const handleEdit = (column: Column) => {
    startEdit(column);
    modal.openModal(column);
  };

  const handleDelete = (id: string | number) => {
    if (confirm('정말로 이 칼럼을 삭제하시겠습니까?')) {
      setColumns(columns.filter((col) => col.id !== id));
    }
  };

  const togglePublished = (id: string | number) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, isPublished: !col.isPublished } : col)));
  };

  const getFilteredColumns = () => {
    if (selectedCohort === 'all') return columns;
    return columns.filter((col) => col.cohort === selectedCohort);
  };

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={<DocumentTextIcon className='w-6 h-6 text-slate-600' />}
        title='칼럼'
        description='전문가의 노하우와 인사이트를 공유하세요'
        selectedCohort={selectedCohort}
        availableCohorts={availableCohorts}
        onCohortChange={(cohort) => setSelectedCohort(cohort)}
        actions={
          <button
            onClick={() => {
              resetForm();
              modal.openModal();
            }}
            className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <PlusIcon className='w-4 h-4' />
            <span>새 칼럼 작성</span>
          </button>
        }
      />

      {/* 칼럼 목록 */}
      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {selectedCohort === 'all' ? '전체' : `${selectedCohort}기`} 칼럼 목록
          </h2>
        </div>

        {getFilteredColumns().length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <PencilIcon className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p className='text-lg mb-2'>아직 작성된 칼럼이 없습니다.</p>
            <button
              onClick={() => {
                resetForm();
                modal.openModal();
              }}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              첫 번째 칼럼 작성하기
            </button>
          </div>
        ) : (
          <div className='divide-y divide-slate-200'>
            {getFilteredColumns().map((column) => (
              <AdminContentCard
                key={column.id}
                title={column.title}
                content={column.content}
                cohort={column.cohort || 'all'}
                author={column.author}
                createdAt={column.createdAt}
                badges={[
                  <Badge key='status' variant={column.isPublished ? 'success' : 'default'} size='sm'>
                    {column.isPublished ? '공개' : '비공개'}
                  </Badge>,
                ]}
                onView={() => modal.openView(column)}
                onEdit={() => handleEdit(column)}
                onDelete={() => handleDelete(column.id)}
                extraActions={[
                  <button
                    key='publish'
                    onClick={() => togglePublished(column.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      column.isPublished ? 'text-gray-600 hover:bg-gray-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={column.isPublished ? '비공개로 변경' : '공개로 변경'}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d={
                          column.isPublished
                            ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        }
                      />
                    </svg>
                  </button>,
                ]}
              />
            ))}
          </div>
        )}
      </div>

      {/* 작성/수정 모달 */}
      <Modal
        show={modal.isOpen}
        title={modal.selectedItem ? '칼럼 수정' : '새 칼럼 작성'}
        onClose={modal.closeModal}
        size='4xl'
      >
        <form onSubmit={handleSubmit}>
          <div className='space-y-6'>
            <InputField
              label='칼럼 제목'
              value={form.title}
              onChange={(value: string) => updateForm({ title: value })}
              placeholder='칼럼 제목을 입력하세요'
              required
            />

            <Select
              label='대상 기수'
              value={form.cohort}
              onChange={(value) => updateForm({ cohort: value })}
              options={availableCohorts.map((cohort) => ({ value: cohort, label: `${cohort}기` }))}
            />

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>칼럼 내용</label>
              <MarkdownEditor
                value={form.content}
                onChange={(value) => updateForm({ content: value })}
                placeholder='마크다운으로 칼럼 내용을 작성하세요!'
                className='min-h-[300px]'
              />
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={form.isPublished}
                onChange={(e) => updateForm({ isPublished: e.target.checked })}
                className='rounded border-gray-300'
              />
              <label className='ml-2 text-sm text-slate-700'>즉시 공개</label>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200'>
            <Button type='button' onClick={modal.closeModal} variant='outline' disabled={submitting}>
              취소
            </Button>
            <Button type='submit' variant='primary' disabled={submitting} isLoading={submitting}>
              {modal.selectedItem ? '수정 완료' : '작성 완료'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 상세보기 모달 */}
      <Modal show={!!modal.viewItem} title={modal.viewItem?.title || ''} onClose={modal.closeView} size='2xl'>
        {modal.viewItem && (
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
                {modal.viewItem.cohort}기
              </span>
              <span className='text-sm text-slate-600'>{modal.viewItem.author}</span>
              <span className='text-sm text-slate-600'>{modal.viewItem.createdAt}</span>
            </div>

            <div
              className='prose prose-slate max-w-none'
              dangerouslySetInnerHTML={{ __html: modal.viewItem.content }}
            />

            <div className='pt-4 border-t border-slate-200 flex justify-end'>
              <Button onClick={modal.closeView} variant='outline'>
                닫기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
