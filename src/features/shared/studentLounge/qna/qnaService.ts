/**
 * QnA 게시판 API 서비스
 */

import { supabase } from '@/lib/supabase/client';
import { Question, Answer } from '@/types/domains/qna';

/**
 * 질문 목록 조회
 * @returns 모든 질문 목록 (최신순 정렬)
 * - profiles 테이블과 JOIN하여 작성자 정보(이름, 닉네임, 기수) 포함
 * - qna_answers 테이블과 LEFT JOIN하여 답변 정보 포함
 * - 최신 질문이 위에 오도록 정렬
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    // 먼저 간단한 쿼리로 테스트
    const { data, error } = await supabase
      .from('qna_questions')
      .select(
        `
      *,
      profiles!student_id (name, nickname, cohort),
      qna_answers (
        *,
        profiles!admin_id (name, nickname)
      )
    `
      )
      .order('created_at', { ascending: false });

    if (error) {
      // 에러 상세 정보 출력
      console.error('Supabase 에러 상세:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(error.message || '질문 목록을 불러오는 중 오류가 발생했습니다.');
    }

    console.log('조회된 데이터:', data);

    // 데이터 형식을 컴포넌트에서 사용하기 쉽게 변환
    // student, admin 정보를 flat하게 펼침
    return (data || []).map((item: any) => ({
      ...item,
      student_name: item.profiles?.name,
      student_nickname: item.profiles?.nickname,
      cohort: item.profiles?.cohort,
      answer: item.qna_answers?.[0]
        ? {
            ...item.qna_answers[0],
            admin_name: item.qna_answers[0].profiles?.name,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('fetchQuestions 오류:', error);
    throw error;
  }
};

/**
 * 새 질문 작성
 * @param title - 질문 제목
 * @param content - 질문 내용
 * @returns 생성된 질문 객체
 *
 * 특징:
 * - 현재 로그인한 사용자를 작성자로 자동 설정
 * - 초기 상태는 'open'으로 설정
 * - 생성 즉시 해당 질문 데이터 반환
 */
export const createQuestion = async (title: string, content: string): Promise<Question> => {
  try {
    // 현재 로그인한 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 질문 생성
    const { data, error } = await supabase
      .from('qna_questions')
      .insert({
        title,
        content,
        student_id: user.id, // 작성자는 현재 로그인한 사용자
        status: 'open', // 초기 상태는 미답변
      })
      .select() // 생성된 데이터 반환
      .single(); // 단일 객체로 반환

    if (error) {
      console.error('질문 작성 오류:', error);
      throw new Error('질문 작성 중 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('createQuestion 오류:', error);
    throw error;
  }
};

/**
 * 질문 수정
 * @param questionId - 수정할 질문 ID
 * @param title - 새 제목
 * @param content - 새 내용
 * @returns 수정된 질문 객체
 *
 * 특징:
 * - 본인이 작성한 질문만 수정 가능 (student_id 체크)
 * - updated_at 자동 갱신
 */
export const updateQuestion = async (questionId: string, title: string, content: string): Promise<Question> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('qna_questions')
      .upsert({
        id: questionId,
        student_id: user.id,
        title,
        content,
        updated_at: new Date().toISOString(), // 수정 시간 갱신
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('질문 수정 오류:', error);
      // 권한 없음 에러일 가능성 있음
      throw new Error('질문 수정 중 오류가 발생했습니다. 본인의 질문만 수정 가능합니다.');
    }

    return data;
  } catch (error) {
    console.error('updateQuestion 오류:', error);
    throw error;
  }
};

/**
 * 질문 삭제
 * @param questionId - 삭제할 질문 ID
 * @param isAdmin - 관리자 여부 (관리자는 모든 질문 삭제 가능)
 *
 * 특징:
 * - 일반 사용자: 본인 질문만 삭제 가능
 * - 관리자: 모든 질문 삭제 가능
 * - 연관된 답변도 CASCADE로 자동 삭제 (DB 설정 필요)
 */
export const deleteQuestion = async (questionId: string, isAdmin: boolean = false): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    let query = supabase.from('qna_questions').delete().eq('id', questionId);

    // 관리자가 아니면 본인 확인 조건 추가
    if (!isAdmin) {
      query = query.eq('student_id', user.id);
    }

    const { error } = await query;

    if (error) {
      console.error('질문 삭제 오류:', error);
      throw new Error('질문 삭제 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('deleteQuestion 오류:', error);
    throw error;
  }
};

/**
 * 관리자 답변 작성
 * @param questionId - 답변할 질문 ID
 * @param content - 답변 내용
 * @returns 생성된 답변 객체
 *
 * 특징:
 * - 답변 작성 후 질문 상태를 'answered'로 자동 변경
 * - 한 질문에 여러 답변 가능 (필요시 제한 추가 가능)
 */
export const createAnswer = async (questionId: string, content: string): Promise<Answer> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 1. 답변 작성
    const { data: answer, error: answerError } = await supabase
      .from('qna_answers')
      .insert({
        question_id: questionId,
        content,
        admin_id: user.id, // 답변 작성자(관리자)
      })
      .select()
      .single();

    if (answerError) {
      console.error('답변 작성 오류:', answerError);
      throw new Error('답변 작성 중 오류가 발생했습니다.');
    }

    // 2. 질문 상태를 'answered'로 업데이트
    const { error: updateError } = await supabase
      .from('qna_questions')
      .upsert({
        id: questionId,
        status: 'answered',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (updateError) {
      // 상태 업데이트 실패해도 답변은 이미 작성됨
      console.warn('질문 상태 업데이트 경고:', updateError.message);
    }

    return answer;
  } catch (error) {
    console.error('createAnswer 오류:', error);
    throw error;
  }
};

/**
 * 답변 수정
 * @param answerId - 수정할 답변 ID
 * @param content - 새 답변 내용
 * @returns 수정된 답변 객체
 *
 * 특징:
 * - 본인이 작성한 답변만 수정 가능
 */
export const updateAnswer = async (answerId: string, content: string): Promise<Answer> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('qna_answers')
      .upsert({
        id: answerId,
        admin_id: user.id,
        content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('답변 수정 오류:', error);
      throw new Error('답변 수정 중 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('updateAnswer 오류:', error);
    throw error;
  }
};


/**
 * 특정 기수의 질문만 조회 (관리자용)
 * @param cohort - 기수 (ex: '1', '2', 'all')
 * @returns 해당 기수의 질문 목록
 */
export const fetchQuestionsByCohort = async (cohort: string): Promise<Question[]> => {
  try {
    // 'all'이면 전체 조회
    if (cohort === 'all') {
      return fetchQuestions();
    }

    const { data, error } = await supabase
      .from('qna_questions')
      .select(
        `
          *,
          student:profiles!qna_questions_student_id_fkey (
            name,
            nickname,
            cohort
          ),
          qna_answers (
            *,
            admin:profiles!qna_answers_admin_id_fkey (
              name,
              nickname
            )
          )
        `
      )
      // profiles 테이블의 cohort로 필터링
      .eq('student.cohort', cohort)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('기수별 질문 조회 오류:', error);
      throw new Error('질문 목록을 불러오는 중 오류가 발생했습니다.');
    }

    // 데이터 변환
    return (data || []).map((item: any) => ({
      ...item,
      student_name: item.student?.name,
      student_nickname: item.student?.nickname,
      cohort: item.student?.cohort,
      answer: item.qna_answers?.[0]
        ? {
            ...item.qna_answers[0],
            admin_name: item.qna_answers[0].admin?.name,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('fetchQuestionsByCohort 오류:', error);
    throw error;
  }
};
