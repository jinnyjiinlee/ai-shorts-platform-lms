'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from './MarkdownEditor';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminModal from '@/components/admin/AdminModal';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import AdminContentCard from '@/components/admin/AdminContentCard';

interface Column {
  id: number;
  title: string;
  content: string;
  cohort: number;
  createdAt: string;
  author: string;
  isPublished: boolean;
}

export default function GuidebookManagement() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 1,
      title: '유튜브 쇼츠 알고리즘 완전 정복',
      content: '유튜브 쇼츠 알고리즘의 작동 원리와 활용법에 대해 상세히 설명합니다...',
      cohort: 1,
      createdAt: '2024-08-20',
      author: '하대표',
      isPublished: true,
    },
    {
      id: 2,
      title: '첫 영상에서 구독자 1000명 모으기',
      content: '성공적인 첫 영상 제작을 위한 전략과 주의사항들을 정리해드립니다...',
      cohort: 1,
      createdAt: '2024-08-18',
      author: '하대표',
      isPublished: false,
    },
  ]);

  const [form, setForm] = useState({ title: '', content: '', cohort: 1, isPublished: true });
  const [showForm, setShowForm] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [viewingColumn, setViewingColumn] = useState<Column | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<number | 'all'>('all');

  const availableCohorts = [1, 2, 3];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newColumn: Column = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      author: '하대표',
    };

    if (editingColumn) {
      setColumns(columns.map((col) => (col.id === editingColumn.id ? { ...newColumn, id: editingColumn.id } : col)));
      setEditingColumn(null);
    } else {
      setColumns([newColumn, ...columns]);
    }

    setForm({ title: '', content: '', cohort: 1, isPublished: true });
    setShowForm(false);
  };

  const handleEdit = (column: Column) => {
    setForm({ title: column.title, content: column.content, cohort: column.cohort, isPublished: column.isPublished });
    setEditingColumn(column);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 칼럼을 삭제하시겠습니까?')) {
      setColumns(columns.filter((col) => col.id !== id));
    }
  };

  const togglePublished = (id: number) => {
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
        onCohortChange={(cohort) => setSelectedCohort(cohort === 'all' ? 'all' : (cohort as number))}
        actions={
          <button
            onClick={() => {
              setEditingColumn(null);
              setForm({ title: '', content: '', cohort: 1, isPublished: true });
              setShowForm(true);
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
                setEditingColumn(null);
                setForm({ title: '', content: '', cohort: 1, isPublished: true });
                setShowForm(true);
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
                cohort={column.cohort}
                author={column.author}
                createdAt={column.createdAt}
                badges={[
                  <span
                    key='status'
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      column.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {column.isPublished ? '공개' : '비공개'}
                  </span>,
                ]}
                onView={() => setViewingColumn(column)}
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
      <AdminModal
        show={showForm}
        title={editingColumn ? '칼럼 수정' : '새 칼럼 작성'}
        onClose={() => {
          setShowForm(false);
          setEditingColumn(null);
        }}
        onSubmit={handleSubmit}
        submitText={editingColumn ? '수정 완료' : '작성 완료'}
      >
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>칼럼 제목</label>
            <input
              type='text'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='칼럼 제목을 입력하세요'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>대상 기수</label>
            <select
              value={form.cohort}
              onChange={(e) => setForm({ ...form, cohort: parseInt(e.target.value) })}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              {availableCohorts.map((cohort) => (
                <option key={cohort} value={cohort}>
                  {cohort}기
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>칼럼 내용</label>
            <MarkdownEditor
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              placeholder='마크다운으로 칼럼 내용을 작성하세요!'
              className='min-h-[300px]'
            />
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className='rounded border-gray-300'
            />
            <label className='ml-2 text-sm text-slate-700'>즉시 공개</label>
          </div>
        </div>
      </AdminModal>

      {/* 상세보기 모달 */}
      <AdminModal
        show={!!viewingColumn}
        title={viewingColumn?.title || ''}
        onClose={() => setViewingColumn(null)}
        showActions={false}
      >
        {viewingColumn && (
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>{viewingColumn.cohort}기</span>
              <span className='text-sm text-slate-600'>{viewingColumn.author}</span>
              <span className='text-sm text-slate-600'>{viewingColumn.createdAt}</span>
            </div>

            <div className='prose prose-slate max-w-none' dangerouslySetInnerHTML={{ __html: viewingColumn.content }} />

            <div className='pt-4 border-t border-slate-200 flex justify-end'>
              <button
                onClick={() => setViewingColumn(null)}
                className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
