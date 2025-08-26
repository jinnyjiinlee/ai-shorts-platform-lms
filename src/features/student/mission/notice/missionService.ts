import { supabase } from '@/lib/supabase/client';
import { Mission } from '../shared/types';

export const fetchStudentMissions = async (studentCohort: number): Promise<Mission[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 먼저 모든 미션 가져오기 (cohort가 null인 것도 포함)
    const { data: missions, error: missionError } = await supabase
      .from('mission_notice')
      .select('*')
      .or(`cohort.eq.${studentCohort},cohort.is.null`)
      .order('created_at', { ascending: false });

    if (missionError) {
      console.error('미션 데이터 조회 오류:', missionError);
      throw new Error('미션 데이터를 불러오는 중 오류가 발생했습니다.');
    }

    // 해당 학생의 제출 데이터 가져오기
    const { data: submissions, error: submissionError } = await supabase
      .from('mission_submit')
      .select('*')
      .eq('student_id', user.id);

    if (submissionError) {
      console.error('제출 데이터 조회 오류:', submissionError);
      throw new Error('제출 데이터를 불러오는 중 오류가 발생했습니다.');
    }

    // 제출 데이터를 미션 ID로 매핑
    const submissionMap = new Map();
    (submissions || []).forEach((submission) => {
      submissionMap.set(submission.mission_id, submission);
    });

    // 미션들을 제출 여부에 따라 매핑
    const missionList = (missions || []).map((mission) => {
      const submission = submissionMap.get(mission.id);

      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        week: mission.week || 1,

        dueDate: mission.due_date,
        dueDateFormatted: new Date(mission.due_date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isSubmitted: !!submission,
        submittedAt: submission
          ? new Date(submission.submitted_at).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : undefined,
        status: submission ? ('submitted' as const) : ('pending' as const),
        submission_type: mission.submission_type || 'file',
        feedback: undefined,
        submissionContent: submission?.content || '',
      };
    });

    return missionList.sort((a, b) => b.week - a.week);
  } catch (error) {
    console.error('학생 미션 데이터 가져오기 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('미션 데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.');
  }
};

export const getStudentCohort = async (): Promise<number> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data: profile, error } = await supabase.from('profiles').select('cohort').eq('id', user.id).single();

    if (error) {
      console.error('사용자 기수 조회 오류:', error);
      throw new Error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    }

    return profile?.cohort || 1;
  } catch (error) {
    console.error('학생 기수 가져오기 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('사용자 정보를 불러오는 중 예상치 못한 오류가 발생했습니다.');
  }
};
