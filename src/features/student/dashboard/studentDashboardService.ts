// 사용

import { supabase } from '@/lib/supabase/client';
import { AuthService, DatabaseService, ErrorService } from '@/lib/service';
import { dateUtils } from '@/lib/utils';

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
    // 🎯 공통 서비스 사용으로 중복 제거
    const user = await AuthService.getAuthUser();
    const profile = await AuthService.getUserProfile(user.id);

    // 🎯 병렬 처리로 성능 향상
    const [missions, submissions] = await Promise.all([
      getMissionsByCohort(profile.cohort),
      getStudentSubmissions(user.id),
    ]);

    const totalMissions = missions.length;

    // 🎯 계산 로직을 별도 함수로 분리
    return calculateStudentStats(missions, submissions, totalMissions);
  } catch (error) {
    // 🎯 에러 처리 통합
    ErrorService.handleError(error, '대시보드 데이터를 불러오는 중 오류가 발생했습니다');
  }
};

// 🎯 공통 데이터 조회 함수들
async function getMissionsByCohort(cohort: string) {
  const { data, error } = await supabase
    .from('mission_notice')
    .select('id, title, due_date, week')
    .eq('cohort', cohort)
    .order('week', { ascending: true });

  if (error) ErrorService.handleError(error, '미션 데이터 조회 실패');
  return data || [];
}

async function getStudentSubmissions(studentId: string) {
  const { data, error } = await supabase
    .from('mission_submit')
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
    .eq('student_id', studentId);

  if (error) ErrorService.handleError(error, '제출 데이터 조회 실패');
  return data || [];
}

// 🎯 계산 로직 분리
function calculateStudentStats(missions: any[], submissions: any[], totalMissions: number): StudentDashboardStats {
  // 완료된 미션 수 계산
  const uniqueMissionIds = new Set(submissions.map((s) => s.mission_id));
  const completedMissions = uniqueMissionIds.size;
  const completionRate = dateUtils.calculateRate(completedMissions, totalMissions);

  // 현재 주차 계산 (가장 최근 미션의 주차)
  const currentWeek = missions.length > 0 ? Math.max(...missions.map((m) => m.week)) : 1;

  // 다가오는 마감일 계산
  const upcomingDeadlines = calculateUpcomingDeadlines(missions, submissions);

  // 주차별 진행 상황 생성
  const weeklyProgress = missions
    .map((mission) => ({
      week: mission.week,
      title: mission.title,
      completed: submissions.some((sub) => sub.mission_id === mission.id),
      dueDate: mission.due_date,
    }))
    .sort((a, b) => a.week - b.week);

  // 최근 제출 현황
  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5)
    .map((sub) => ({
      id: sub.id,
      missionTitle: (sub.mission_notice as { title?: string })?.title || '미션',
      submittedAt: sub.submitted_at,
      status: sub.status as 'pending' | 'completed' | 'rejected',
    }));

  return {
    completedMissions,
    totalMissions,
    completionRate,
    currentWeek,
    weeklyProgress,
    upcomingDeadlines,
    recentSubmissions,
  };
}

function calculateUpcomingDeadlines(missions: any[], submissions: any[]) {
  const now = new Date();

  return missions
    .filter((mission) => {
      const dueDate = new Date(mission.due_date);
      const isNotSubmitted = !submissions.some((sub) => sub.mission_id === mission.id);
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
    .slice(0, 3);
}
