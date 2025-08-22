import { supabase } from '../../supabase/client';

export interface WeeklyProgress {
  week: number;
  weekName: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  submitted: number;
  inProgress: number;
  notStarted: number;
  submissionRate: number;
  previousWeekRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CohortWeeklyData {
  cohort: number;
  weeks: WeeklyProgress[];
  overallRate: number;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalMissions: number;
  averageCompletionRate: number;
  cohortData: CohortWeeklyData[];
}

export const fetchAdminTrackingData = async (): Promise<AdminDashboardStats> => {
  try {
    // 모든 기수 가져오기
    const { data: cohorts, error: cohortError } = await supabase
      .from('profiles')
      .select('cohort')
      .not('cohort', 'is', null);

    if (cohortError) throw cohortError;

    const uniqueCohorts = [...new Set(cohorts?.map(p => p.cohort) || [])];

    // 각 기수별 데이터 가져오기
    const cohortData: CohortWeeklyData[] = [];

    for (const cohort of uniqueCohorts) {
      // 해당 기수의 미션들 가져오기
      const { data: missions, error: missionError } = await supabase
        .from('mission_notice')
        .select('*')
        .eq('cohort', cohort)
        .order('week', { ascending: true });

      if (missionError) throw missionError;

      // 해당 기수의 학생 수 계산
      const { data: students, error: studentError } = await supabase
        .from('profiles')
        .select('id')
        .eq('cohort', cohort);

      if (studentError) throw studentError;

      const totalStudents = students?.length || 0;

      // 각 주차별 제출 현황 계산
      const weeks: WeeklyProgress[] = [];
      let previousWeekRate = 0;

      for (const mission of missions || []) {
        // 해당 미션의 제출 현황 가져오기
        const { data: submissions, error: submissionError } = await supabase
          .from('mission_submissions')
          .select('*')
          .eq('mission_id', mission.id);

        if (submissionError) throw submissionError;

        const submitted = submissions?.length || 0;
        const submissionRate = totalStudents > 0 ? Math.round((submitted / totalStudents) * 100) : 0;
        
        // 트렌드 계산
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (previousWeekRate > 0) {
          if (submissionRate > previousWeekRate) trend = 'up';
          else if (submissionRate < previousWeekRate) trend = 'down';
        }

        weeks.push({
          week: mission.week,
          weekName: mission.title,
          startDate: new Date(mission.created_at).toISOString().split('T')[0],
          endDate: new Date(mission.due_date).toISOString().split('T')[0],
          totalStudents,
          submitted,
          inProgress: Math.floor(Math.random() * 3), // TODO: 실제 진행중 상태 구현
          notStarted: totalStudents - submitted,
          submissionRate,
          previousWeekRate,
          trend
        });

        previousWeekRate = submissionRate;
      }

      const overallRate = weeks.length > 0 
        ? Math.round(weeks.reduce((sum, w) => sum + w.submissionRate, 0) / weeks.length)
        : 0;

      cohortData.push({
        cohort,
        weeks,
        overallRate
      });
    }

    // 전체 통계 계산
    const totalStudents = cohorts?.length || 0;
    const totalMissions = cohortData.reduce((sum, c) => sum + c.weeks.length, 0);
    const averageCompletionRate = cohortData.length > 0
      ? Math.round(cohortData.reduce((sum, c) => sum + c.overallRate, 0) / cohortData.length)
      : 0;

    return {
      totalStudents,
      totalMissions,
      averageCompletionRate,
      cohortData
    };

  } catch (error) {
    console.error('관리자 추적 데이터 로드 오류:', error);
    throw new Error('추적 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};