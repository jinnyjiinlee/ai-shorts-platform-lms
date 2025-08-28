'use client';

import { useState } from 'react';
import { SpeakerWaveIcon, PlusIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../columns/MarkdownEditor';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';
import AdminContentCard from '@/components/admin/AdminContentCard';
import { Modal } from '@/features/shared/ui/Modal';
import { Button } from '@/features/shared/ui/Button';
import { InputField } from '@/features/shared/ui/InputField';
import { Badge } from '@/features/shared/ui/Badge';
import { Select } from '@/features/shared/ui/Select';
import { useModal } from '@/features/shared/hooks/useModal';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { Announcement } from '@/types/domains/community';

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string | 'all'>('all');

  const modal = useModal<Announcement>();
  const { form, updateForm, resetForm, startEdit, isEditing } = useFormState({
    title: '',
    content: '',
    cohort: '1',
    pinned: false,
  });

  const availableCohorts = ['1', '2', '3'];

  const { submitting, submit } = useAsyncSubmit(async () => {
    const newAnnouncement: Announcement = {
      ...form,
      id: Date.now(),
      author: '하대표',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (modal.selectedItem) {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === modal.selectedItem!.id ? { ...newAnnouncement, id: modal.selectedItem!.id } : ann
        )
      );
    } else {
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    resetForm();
    modal.closeModal();
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    submit();
  };

  const handleEdit = (announcement: Announcement) => {
    startEdit(announcement);
    modal.openModal(announcement);
  };

  const handleDelete = (id: string | number) => {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      setAnnouncements(announcements.filter((ann) => ann.id !== id));
    }
  };

  const togglePinned = (id: string | number) => {
    setAnnouncements(announcements.map((ann) => (ann.id === id ? { ...ann, pinned: !ann.pinned } : ann)));
  };

  const getFilteredAnnouncements = () => {
    if (selectedCohort === 'all') return announcements;
    return announcements.filter((ann) => ann.cohort === selectedCohort || ann.cohort === 'all');
  };

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={<SpeakerWaveIcon className='w-6 h-6 text-slate-600' />}
        title='공지사항'
        description='중요한 소식과 업데이트를 전달하세요'
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
            <span>새 공지 작성</span>
          </button>
        }
      />

      {/* 공지사항 목록 */}
      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>
            {selectedCohort === 'all' ? '전체' : `${selectedCohort}기`} 공지사항 목록
          </h2>
        </div>

        {getFilteredAnnouncements().length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <SpeakerWaveIcon className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p className='text-lg mb-2'>아직 작성된 공지사항이 없습니다.</p>
            <button
              onClick={() => {
                resetForm();
                modal.openModal();
              }}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              첫 번째 공지사항 작성하기
            </button>
          </div>
        ) : (
          <div className='divide-y divide-slate-200'>
            {getFilteredAnnouncements()
              .sort((a, b) => {
                // 고정된 공지사항을 먼저 표시
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((announcement) => (
                <AdminContentCard
                  key={announcement.id}
                  title={announcement.title}
                  content={announcement.content}
                  cohort={announcement.cohort}
                  author={announcement.author}
                  createdAt={announcement.createdAt}
                  badges={[
                    announcement.pinned && (
                      <Badge variant='danger' size='sm'>
                        📌 고정
                      </Badge>
                    ),
                  ].filter(Boolean)}
                  onView={() => modal.openView(announcement)}
                  onEdit={() => handleEdit(announcement)}
                  onDelete={() => handleDelete(announcement.id)}
                  extraActions={[
                    <button
                      key='pin'
                      onClick={() => togglePinned(announcement.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        announcement.pinned ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      title={announcement.pinned ? '고정 해제' : '상단 고정'}
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
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
        title={modal.selectedItem ? '공지사항 수정' : '새 공지사항 작성'}
        onClose={modal.closeModal}
        size='4xl'
      >
        <form onSubmit={handleSubmit}>
          <div className='space-y-6'>
            <InputField
              label='제목'
              value={form.title}
              onChange={(value: string) => updateForm({ title: value })}
              placeholder='공지사항 제목을 입력하세요'
              required
            />

            <Select
              label='대상 기수'
              value={form.cohort}
              onChange={(value) => updateForm({ cohort: value })}
              options={[
                { value: 'all', label: '전체 기수' },
                ...availableCohorts.map((cohort) => ({ value: cohort, label: `${cohort}기` })),
              ]}
            />

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>내용</label>
              <MarkdownEditor
                value={form.content}
                onChange={(value: string) => updateForm({ content: value })}
                placeholder='마크다운으로 공지사항 내용을 작성하세요!'
                className='min-h-[300px]'
              />
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
              {modal.viewItem.pinned && (
                <Badge variant='danger' size='sm'>
                  📌 고정
                </Badge>
              )}
              <Badge variant='info' size='sm'>
                {modal.viewItem.cohort === 'all' ? '전체' : `${modal.viewItem.cohort}기`}
              </Badge>
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
