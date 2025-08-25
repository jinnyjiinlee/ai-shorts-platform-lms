// 사용

import { supabase } from '../../../lib/supabase/client';

export interface StudentDashboardStats {
  completedMissions: number;
  totalMissions: number;
  completionRate: number;
  currentWeek: number;
  weeklyProgress: Array<{
    week: number;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    daysLeft: number;
  }>;
  recentSubmissions: Array<{
    id: string;
    missionTitle: string;
    submittedAt: string;
    status: 'pending' | 'completed' | 'rejected';
  }>;
}

export const fetchStudentDashboardData = async (): Promise<StudentDashboardStats> => {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('사용자 정보를 찾을 수 없습니다.');

    // 사용자 프로필에서 기수 정보 가져오기
    const { data: profile } = await supabase.from('profiles').select('cohort').eq('id', user.id).single();

    if (!profile) throw new Error('프로필 정보를 찾을 수 없습니다.');

    // 해당 기수의 모든 미션 가져오기
    const { data: missions, error: missionError } = await supabase
      .from('mission_notice')
      .select('id, title, due_date, week')
      .eq('cohort', profile.cohort)
      .order('week', { ascending: true });

    if (missionError) throw missionError;

    const totalMissions = missions?.length || 0;

    // 내 제출 현황 가져오기
    const { data: submissions, error: submissionError } = await supabase
      .from('mission_submissions')
      .select(
        `
        id,
        mission_id,
        submitted_at,
        status,
        mission_notice (
          title,
          due_date
        )
      `
      )
      .eq('student_id', user.id);

    if (submissionError) throw submissionError;

    // 완료된 미션 수 계산
    const uniqueMissionIds = new Set(submissions?.map((s) => s.mission_id) || []);
    const completedMissions = uniqueMissionIds.size;
    const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

    // 현재 주차 계산 (가장 최근 미션의 주차)
    const currentWeek = missions && missions.length > 0 ? Math.max(...missions.map((m) => m.week)) : 1;

    // 다가오는 마감일 계산
    const now = new Date();
    const upcomingDeadlines =
      missions
        ?.filter((mission) => {
          const dueDate = new Date(mission.due_date);
          const isNotSubmitted = !submissions?.some((sub) => sub.mission_id === mission.id);
          return dueDate > now && isNotSubmitted;
        })
        .map((mission) => {
          const dueDate = new Date(mission.due_date);
          const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return {
            id: mission.id,
            title: mission.title,
            dueDate: mission.due_date,
            daysLeft,
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3) || [];

    // 주차별 진행 상황 생성 (실제 미션 기반)
    const weeklyProgress =
      missions
        ?.map((mission) => ({
          week: mission.week,
          title: mission.title,
          completed: submissions?.some((sub) => sub.mission_id === mission.id) || false,
          dueDate: mission.due_date,
        }))
        .sort((a, b) => a.week - b.week) || [];

    // 최근 제출 현황
    const recentSubmissions =
      submissions
        ?.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
        .slice(0, 5)
        .map((sub) => ({
          id: sub.id,
          missionTitle: (sub.mission_notice as { title?: string })?.title || '미션',
          submittedAt: sub.submitted_at,
          status: sub.status as 'pending' | 'completed' | 'rejected',
        })) || [];

    return {
      completedMissions,
      totalMissions,
      completionRate,
      currentWeek,
      weeklyProgress,
      upcomingDeadlines,
      recentSubmissions,
    };
  } catch (error) {
    console.error('학생 대시보드 데이터 로드 오류:', error);
    throw new Error('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};
