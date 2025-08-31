// hooks/useQnA.ts
import { useState, useEffect } from 'react';
import { Question } from '@/types/domains/qna';
import { fetchQuestions, createQuestion, deleteQuestion, updateQuestion, createAnswer } from '../qnaService';
import { usePagination } from '@/features/shared/ui/Pagination/usePagination';

/**
 * QnA 관련 모든 로직을 관리하는 Custom Hook
 * - API 호출 로직
 * - 상태 관리
 * - 에러 처리
 */
export const useQnA = (userRole: 'admin' | 'student', userCohort?: string) => {
  // 상태 관리
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // 질문 상세 모달 상태 관리
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // 페이지네이션 설정
  const QUESTIONS_PER_PAGE = 10;

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedQuestions,
    handlePageChange,
  } = usePagination({
    data: questions,
    itemsPerPage: QUESTIONS_PER_PAGE,
  });

  // 질문 목록 불러오기
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchQuestions();
  
      // 1기 전용 게시판이므로 모든 질문 표시
      // 필터링 불필요: 어차피 1기 학생들의 질문만 있음
      // 나중에 2기 게시판은 별도 라우트(/qna2)로 구현 예정
      setQuestions(data);
      
    } catch (err) {
      setError('질문 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 질문 작성
  const handleCreateQuestion = async (title: string, content: string) => {
    try {
      await createQuestion(title, content);
      await loadQuestions();
      setShowQuestionModal(false);
      // Toast 알림 추가 가능
    } catch (err) {
      console.error('질문 작성 실패:', err);
      throw err; // 모달에서 처리하도록 다시 throw
    }
  };

  // 질문 삭제 (수강생)
  const handleDeleteMyQuestion = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteQuestion(id, false);
      await loadQuestions();
      // Toast: '삭제되었습니다'
    } catch (err) {
      alert('삭제 실패했습니다.');
    }
  };

  // 질문 삭제 (관리자)
  const handleAdminDelete = async (id: string) => {
    if (!confirm('이 질문을 삭제하시겠습니까?')) return;

    try {
      await deleteQuestion(id, true);
      await loadQuestions();
    } catch (err) {
      alert('삭제 실패했습니다.');
    }
  };

  // 질문 수정
  const handleEditQuestion = async (questionId: string, title: string, content: string) => {
    try {
      await updateQuestion(questionId, title, content);
      await loadQuestions();
    } catch (err) {
      console.error('수정 실패:', err);
      throw err;
    }
  };

  // 답변 작성
  const handleCreateAnswer = async (questionId: string, content: string) => {
    try {
      await createAnswer(questionId, content);
      await loadQuestions();
    } catch (err) {
      console.error('답변 작성 실패:', err);
      throw err;
    }
  };

  // 질문 상세보기 함수 추가
  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowDetailModal(true);
  };

  // 초기 로드
  useEffect(() => {
    loadQuestions();
  }, []);

  // 반환값: 컴포넌트에서 필요한 모든 것
  return {
    // 상태
    questions,
    loading,
    error,
    showQuestionModal,
    showDetailModal,
    selectedQuestion,

    // 페이지네이션 관련 추가
    paginatedQuestions,
    currentPage,
    totalPages,
    handlePageChange,

    // 상태 변경
    setShowQuestionModal,
    setShowDetailModal,

    // 액션
    loadQuestions,
    handleCreateQuestion,
    handleDeleteMyQuestion,
    handleAdminDelete,
    handleEditQuestion,
    handleCreateAnswer,
    handleViewQuestion,
  };
};
