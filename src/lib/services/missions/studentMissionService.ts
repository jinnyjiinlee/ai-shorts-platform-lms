import { supabase } from '../../supabase/client';
import { Mission } from '../../types';

export const fetchStudentMissions = async (studentCohort: number): Promise<Mission[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 미션 데이터와 해당 학생의 제출 데이터를 함께 가져오기
    const { data, error } = await supabase
      .from('mission_notice')
      .select(`
        *,
        mission_submissions!inner (
          id,
          submitted_at,
          status,
          student_id
        )
      `)
      .eq('cohort', studentCohort)
      .eq('mission_submissions.student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('학생 미션 데이터 조회 오류:', error);
      throw new Error('미션 데이터를 불러오는 중 오류가 발생했습니다.');
    }

    // 제출된 미션들
    const submittedMissions = (data || []).map(mission => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      week: mission.week || 1,
      dueDate: new Date(mission.due_date).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isSubmitted: true,
      submittedAt: new Date(mission.mission_submissions[0]?.submitted_at).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'submitted' as const,
      submission_type: mission.submission_type || 'file',
      feedback: undefined // TODO: 피드백 데이터 연동
    }));

    // 모든 미션 가져오기 (제출 여부 상관없이)
    const { data: allMissions, error: allError } = await supabase
      .from('mission_notice')
      .select('*')
      .eq('cohort', studentCohort)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('전체 미션 데이터 조회 오류:', allError);
      throw new Error('미션 데이터를 불러오는 중 오류가 발생했습니다.');
    }

    // 제출되지 않은 미션들
    const submittedMissionIds = new Set(submittedMissions.map(m => m.id));
    const unsubmittedMissions = (allMissions || [])
      .filter(mission => !submittedMissionIds.has(mission.id))
      .map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        week: mission.week || 1,
        dueDate: new Date(mission.due_date).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        isSubmitted: false,
        status: 'pending' as const,
        submission_type: mission.submission_type || 'file',
        feedback: undefined
      }));

    // 제출된 것과 안된 것 합치기
    return [...submittedMissions, ...unsubmittedMissions]
      .sort((a, b) => b.week - a.week); // 주차별 정렬

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('cohort')
      .eq('id', user.id)
      .single();

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