'use client';

import { useState } from 'react';
import { useQnA } from '../hooks/useQnA';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import QuestionCreateModal from './QuestionCreateModal';
import QuestionDetailModal from './QuestionDetailModal';
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

  // Question을 BoardItem으로 변환
  const boardItems: BoardItem[] = paginatedQuestions.map((question) => ({
    id: question.id,
    title: question.title,
    content: question.content,
    author: question.student_nickname || question.student_name || '작성자',
    createdAt: formatDate(question.created_at),
    isPublished: true, // 질문은 기본적으로 발행됨
    badges: [
      <Badge key='status' variant={question.status === 'open' ? 'warning' : 'success'} size='sm'>
        {question.status === 'open' ? '미답변' : '답변완료'}
      </Badge>,
    ],
  }));

  // 필터 옵션 정의
  const filterOptions = [
    { label: '전체', value: 'all', count: questions.length, variant: 'default' as const },
    { label: '미답변', value: 'open', count: questions.filter((q) => q.status === 'open').length, variant: 'danger' as const },
    { label: '답변완료', value: 'answered', count: questions.filter((q) => q.status === 'answered').length, variant: 'success' as const },
  ];

  // 필터링된 boardItems
  const filteredBoardItems = boardItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    const question = questions.find((q) => q.id === item.id);
    return question?.status === selectedFilter;
  });

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value as 'all' | 'open' | 'answered');
  };

  return (
    <div className='space-y-6'>
      {/* UniversalBoard 사용 */}
      <UniversalBoard
        title='Q&A 게시판'
        description={`${cohort}기 질문과 답변 공간`}
        icon={<ChatBubbleLeftRightIcon className='w-6 h-6 text-blue-600' />}
        iconBgColor='bg-blue-100'
        createButtonText='질문하기'
        items={filteredBoardItems}
        userRole={userRole}
        loading={loading}
        error={error || undefined}
        filterOptions={userRole === 'admin' ? filterOptions : undefined}
        selectedFilter={userRole === 'admin' ? selectedFilter : undefined}
        onFilterChange={userRole === 'admin' ? handleFilterChange : undefined}
        onCreateItem={userRole === 'student' ? () => setShowQuestionModal(true) : undefined}
        onViewItem={(item) => {
          const question = questions.find((q) => q.id === item.id);
          if (question) handleViewQuestion(question);
        }}
        onEditItem={(item) => {
          const question = questions.find((q) => q.id === item.id);
          if (question) handleViewQuestion(question);
        }}
        onDeleteItem={(id) => {
          if (userRole === 'student') {
            handleDeleteMyQuestion(id);
          } else {
            handleAdminDelete(id);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />


      {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
      {questions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageInfo={true}
        />
      )}

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
