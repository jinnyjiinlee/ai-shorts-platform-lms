'use client';

import ReactMarkdown from 'react-markdown';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MissionModalProps } from '../types';
import { Modal } from '@/features/shared/ui/Modal';
import TextSubmission from './TextSubmission';
import CompletionStatus from './CompletionStatus';
import { useToast } from '@/features/shared/ui/Toast';
import { Button } from '@/features/shared/ui/Button';

export default function MissionModal({ mission, onClose, onSubmit, refreshMissions }: MissionModalProps) {
  const { addToast, ToastContainer } = useToast();

  if (!mission) return null;

  const getStatusColor = (status: string, isSubmitted?: boolean) => {
    if (isSubmitted && status === 'completed') return 'text-green-600 bg-green-100';
    if (isSubmitted) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getStatusText = (status: string, isSubmitted?: boolean) => {
    if (isSubmitted && status === 'completed') return '완료';
    if (isSubmitted) return '제출 완료';
    return '제출 대기';
  };

  return (
    <>
      <Modal 
        show={!!mission} 
        onClose={onClose} 
        showHeader={false}
        size="lg"
        bodyClassName="p-0"
      >
        {/* Header */}
        <div className='p-6 border-b border-slate-200'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='text-xl font-semibold text-slate-900'>{mission.title}</h3>
              <div className='flex items-center space-x-3 mt-2'>
                <span className='text-sm text-slate-500'>{mission.week}주차</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    mission.status,
                    mission.isSubmitted || false
                  )}`}
                >
                  {getStatusText(mission.status, mission.isSubmitted || false)}
                </span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant='ghost'
              size='md'
              isIconOnly
              className='text-slate-400 hover:text-slate-600'
            >
              <XMarkIcon className='w-6 h-6' />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-3'>
          {/* 미션 설명 */}
          <div>
            <h4 className='font-medium text-slate-900 mb-2'>미션 설명</h4>
            <div className='text-slate-600 leading-relaxed prose prose-slate max-w-none whitespace-pre-line'>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className='text-2xl font-bold text-slate-900 mt-6 mb-4'>{children}</h1>,
                  h2: ({ children }) => <h2 className='text-xl font-bold text-slate-900 mt-5 mb-3'>{children}</h2>,
                  h3: ({ children }) => <h3 className='text-lg font-bold text-slate-900 mt-4 mb-2'>{children}</h3>,
                  p: ({ children }) => <p className='mb-1.5 text-slate-600 whitespace-pre-line'>{children}</p>,
                  ul: ({ children }) => <ul className='list-disc list-inside mb-3 text-slate-600'>{children}</ul>,
                  ol: ({ children }) => <ol className='list-decimal list-inside mb-3 text-slate-600'>{children}</ol>,
                  li: ({ children }) => <li className='mb-1'>{children}</li>,
                  strong: ({ children }) => <strong className='font-bold text-slate-900'>{children}</strong>,
                  em: ({ children }) => <em className='italic'>{children}</em>,
                  code: ({ children }) => (
                    <code className='bg-slate-100 px-1 py-0.5 rounded text-sm font-mono'>{children}</code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className='border-l-4 border-blue-500 pl-4 my-3 text-slate-700 italic'>
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className='text-blue-600 hover:text-blue-800 underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {mission.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* 마감일 */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='font-medium text-slate-900 mb-1'>마감일</h4>
              <p className='text-slate-600'>{mission.dueDateFormatted}</p>
            </div>
            {mission.submittedAt && (
              <div>
                <h4 className='font-medium text-slate-900 mb-1'>제출일</h4>
                <p className='text-slate-600'>{mission.submittedAt}</p>
              </div>
            )}
          </div>

          {/* 텍스트 제출 영역 */}
          <TextSubmission
            missionId={mission.id}
            isSubmitted={mission.isSubmitted || false}
            dueDate={mission.due_date}
            existingSubmissionContent={mission.submissionContent}
            onSubmissionComplete={async () => {
              try {
                // 제출 완료 후 미션 상태 업데이트
                addToast('미션이 성공적으로 제출되었습니다. 🎉', 'success');
                onClose();
                // 새로고침 대신 데이터만 다시 불러오기
                if (refreshMissions) {
                  await refreshMissions();
                }
              } catch (error) {
                console.error('미션 목록 새로고침 오류:', error);
                addToast('미션 목록을 새로고침하는 중 오류가 발생했습니다.', 'error');
                // 오류 시에만 새로고침
                window.location.reload();
              }
            }}
          />

          {/* 관리자 피드백 영역 */}
          {mission.feedback && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-blue-900 mb-2'>📝 관리자 피드백</h4>
              <div className='text-blue-800 whitespace-pre-line leading-relaxed'>{mission.feedback}</div>
            </div>
          )}

          {/* 제출 완료 상태 */}
          <CompletionStatus isCompleted={mission.isSubmitted || false} />

          {/* 닫기 버튼 */}
          <div className='flex justify-end space-x-3 pt-4'>
            <button
              onClick={onClose}
              className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>
      
      <ToastContainer />
    </>
  );
}
