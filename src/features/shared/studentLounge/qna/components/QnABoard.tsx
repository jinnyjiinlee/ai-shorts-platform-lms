'use client';

import { useState } from 'react';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';
import { useQnA } from '../hooks/useQnA';
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import AdminContentCard from '@/components/admin/AdminContentCard';
import QuestionCreateModal from './QuestionCreateModal';
import QuestionDetailModal from './QuestionDetailModal';

import { Button } from '@/features/shared/ui/Button';
import { Badge } from '@/features/shared/ui/Badge';
import { Pagination } from '@/features/shared/ui/Pagination';

interface QnABoardProps {
  userRole: 'admin' | 'student';
  cohort: string;
}

export default function QnABoard({ userRole, cohort }: QnABoardProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'answered'>('all');

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // useQnA Hook에서 모든 로직과 데이터 가져오기
  const {
    questions,
    loading,
    error,
    showQuestionModal,
    setShowQuestionModal,
    showDetailModal,
    selectedQuestion,
    setShowDetailModal,

    // 페이지네이션 관련 추가
    paginatedQuestions,
    currentPage,
    totalPages,
    handlePageChange,

    handleCreateQuestion,
    handleDeleteMyQuestion,
    handleAdminDelete,
    handleEditQuestion,
    handleCreateAnswer,
    handleViewQuestion,
  } = useQnA(userRole, cohort);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return <div className='text-red-500 text-center p-4'>{error}</div>;
  }

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={<ChatBubbleLeftRightIcon className='w-6 h-6 text-slate-600' />}
        title='Q&A 게시판'
        description={`${cohort}기 질문과 답변 공간`}
        actions={
          userRole === 'student' ? (
            <Button onClick={() => setShowQuestionModal(true)} variant='primary'>
              <PlusIcon className='w-4 h-4 mr-2' />
              질문하기
            </Button>
          ) : null
        }
      />

      {/* 질문 목록 */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-slate-900'>질문 목록</h2>

          {/* 통계 영역 - Badge 컴포넌트 재사용 */}
          {userRole === 'admin' && (
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant='default'
                size='sm'
                selectable={true}
                selected={selectedFilter === 'all'}
                onClick={() => setSelectedFilter('all')}
                className='transition-all hover:shadow-sm'
              >
                전체 ({questions.length})
              </Badge>

              <Badge
                variant='danger'
                size='sm'
                selectable={true}
                selected={selectedFilter === 'open'}
                onClick={() => setSelectedFilter('open')}
                className='transition-all hover:shadow-sm hover:bg-red-200'
              >
                미답변 ({questions.filter((q) => q.status === 'open').length})
              </Badge>

              <Badge
                variant='success'
                size='sm'
                selectable={true}
                selected={selectedFilter === 'answered'}
                onClick={() => setSelectedFilter('answered')}
                className='transition-all hover:shadow-sm hover:bg-green-200'
              >
                답변완료 ({questions.filter((q) => q.status === 'answered').length})
              </Badge>
            </div>
          )}
        </div>

        <div className='divide-y divide-slate-200'>
          {paginatedQuestions
            .filter((question) => {
              if (selectedFilter === 'all') return true;
              return question.status === selectedFilter;
            })
            .map((question) => (
            <AdminContentCard
              key={question.id}
              title={question.title}
              content={question.content}
              cohort={cohort}
              author={question.student_nickname || question.student_name || '작성자'}
              createdAt={formatDate(question.created_at)}
              badges={[
                <Badge key='status' variant={question.status === 'open' ? 'warning' : 'success'} size='sm'>
                  {question.status === 'open' ? '미답변' : '답변완료'}
                </Badge>,
              ]}
              onView={() => handleViewQuestion(question)}
              onEdit={() => handleViewQuestion(question)} // 질문 상세보기 모달로 이동
              onDelete={
                userRole === 'student'
                  ? () => handleDeleteMyQuestion(question.id)
                  : () => handleAdminDelete(question.id)
              }
            />
          ))}
        </div>
      </div>

      {/* 페이지네이션 추가 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showPageInfo={true}
      />

      {/* 질문 작성 모달 */}
      <QuestionCreateModal
        show={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        onSubmit={async (data) => {
          await handleCreateQuestion(data.title, data.content);
        }}
      />

      {/* 질문 상세보기 모달 */}
      <QuestionDetailModal
        show={showDetailModal}
        question={selectedQuestion}
        userRole={userRole}
        onClose={() => setShowDetailModal(false)}
        onCreateAnswer={handleCreateAnswer}
        onEditQuestion={handleEditQuestion}
      />
    </div>
  );
}
