// 사용

import { supabase } from '@/lib/supabase/client';
import { AuthService, ErrorService } from '@/lib/service';

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
    // 🎯 사용자 정보 한 번에 가져오기
    const user = await AuthService.getAuthUser();
    
    // 🎯 완전 병렬 처리 - profile 조회와 데이터 조회를 동시에
    const [profile, userSubmissions] = await Promise.all([
      AuthService.getUserProfile(user.id),
      getStudentSubmissions(user.id)
    ]);
    
    // 🎯 cohort를 알았으니 missions 조회
    const missions = await getMissionsByCohort(profile.cohort);

    const totalMissions = missions.length;

    // 🎯 계산 로직을 별도 함수로 분리
    return calculateStudentStats(missions, userSubmissions, totalMissions);
  } catch (error) {
    // 🎯 에러 처리 통합
    ErrorService.handleError(error, '대시보드 데이터를 불러오는 중 오류가 발생했습니다');
  }
};

// 🎯 최적화된 데이터 조회 함수들
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
    .select('id, mission_id, submitted_at, status')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (error) ErrorService.handleError(error, '제출 데이터 조회 실패');
  return data || [];
}

// 🎯 최적화된 계산 로직
function calculateStudentStats(missions: any[], submissions: any[], totalMissions: number): StudentDashboardStats {
  // 한 번에 완료된 미션 ID Set 생성
  const completedMissionIds = new Set(submissions.map((s) => s.mission_id));
  const completedMissions = completedMissionIds.size;
  const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  // 현재 주차 계산 (최적화: 한 번만 계산)
  const currentWeek = missions.length > 0 ? Math.max(...missions.map((m) => m.week)) : 1;

  // 주차별 진행 상황 생성 (최적화: Set 사용)
  const weeklyProgress = missions
    .map((mission) => ({
      week: mission.week,
      title: mission.title,
      completed: completedMissionIds.has(mission.id),
      dueDate: mission.due_date,
    }))
    .sort((a, b) => a.week - b.week);

  // 다가오는 마감일 계산 (최적화)
  const upcomingDeadlines = calculateUpcomingDeadlines(missions, completedMissionIds);

  // 최근 제출 현황 (이미 정렬된 데이터 활용)
  const recentSubmissions = submissions
    .slice(0, 5)
    .map((sub) => {
      // mission title을 직접 조회하지 않고 missions에서 찾기
      const mission = missions.find(m => m.id === sub.mission_id);
      return {
        id: sub.id,
        missionTitle: mission?.title || '미션',
        submittedAt: sub.submitted_at,
        status: sub.status as 'pending' | 'completed' | 'rejected',
      };
    });

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

function calculateUpcomingDeadlines(missions: any[], completedMissionIds: Set<string>) {
  const now = new Date();
  const nowTime = now.getTime();

  return missions
    .filter((mission) => {
      const dueDate = new Date(mission.due_date);
      return dueDate.getTime() > nowTime && !completedMissionIds.has(mission.id);
    })
    .map((mission) => {
      const dueDate = new Date(mission.due_date);
      const daysLeft = Math.ceil((dueDate.getTime() - nowTime) / (1000 * 60 * 60 * 24));
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
