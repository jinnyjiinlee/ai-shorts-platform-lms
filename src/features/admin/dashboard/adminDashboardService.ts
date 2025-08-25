//사용

import { supabase } from '@/lib/supabase/client';

export interface DashboardStats {
  totalActiveStudents: number;
  averageSubmissionRate: number;
  totalActiveMissions: number;
  activeStudentsCount: number;
  pendingApprovals: number;
}

export interface WeeklySubmissionData {
  week: number;
  submitted: number;
  total: number;
  rate: number;
}

export interface CohortDashboardData {
  cohort: string;
  totalStudents: number;
  totalMissions: number;
  submissionRate: number;
  activeStudents: number;
  status: 'active' | 'completed' | 'upcoming';
  weeklySubmissions: WeeklySubmissionData[];
}

// 대시보드 통계 가져오기
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log('대시보드 통계 조회 시작...');

    // 1. 전체 학생 수 (승인된 학생만)
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, cohort')
      .eq('role', 'student')
      .eq('status', 'approved');

    if (studentsError) {
      console.error('학생 데이터 조회 오류:', studentsError);
      throw studentsError;
    }

    // 2. 승인 대기 학생 수
    const { data: pendingStudents, error: pendingError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'student')
      .eq('status', 'pending');

    if (pendingError) {
      console.error('승인 대기 학생 조회 오류:', pendingError);
      throw pendingError;
    }

    // 3. 전체 미션 수
    const { data: missions, error: missionsError } = await supabase.from('mission_notice').select('id, cohort');

    if (missionsError) {
      console.error('미션 데이터 조회 오류:', missionsError);
      throw missionsError;
    }

    // 4. 전체 제출 수
    const { data: submissions, error: submissionsError } = await supabase
      .from('mission_submit')
      .select('id, mission_id, student_id');

    if (submissionsError) {
      console.error('제출 데이터 조회 오류:', submissionsError);
      throw submissionsError;
    }

    // 통계 계산
    const totalActiveStudents = students?.length || 0;
    const pendingApprovals = pendingStudents?.length || 0;
    const totalActiveMissions = missions?.length || 0;

    // 제출률 계산 (중복 제출 제거)
    const uniqueSubmissions = new Map();
    (submissions || []).forEach((sub) => {
      const key = `${sub.mission_id}-${sub.student_id}`;
      uniqueSubmissions.set(key, sub);
    });

    const totalExpectedSubmissions = totalActiveMissions * totalActiveStudents;
    const actualSubmissions = uniqueSubmissions.size;
    const averageSubmissionRate =
      totalExpectedSubmissions > 0 ? Math.round((actualSubmissions / totalExpectedSubmissions) * 100) : 0;

    console.log('대시보드 통계 조회 완료');

    return {
      totalActiveStudents,
      averageSubmissionRate,
      totalActiveMissions,
      activeStudentsCount: totalActiveStudents, // 현재는 같은 값
      pendingApprovals,
    };
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    throw new Error('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

// 기수별 상세 데이터 가져오기
export const fetchCohortData = async (): Promise<CohortDashboardData[]> => {
  try {
    console.log('기수별 데이터 조회 시작...');

    // 1. 기수별 학생 수
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('cohort')
      .eq('role', 'student')
      .eq('status', 'approved');

    if (studentsError) throw studentsError;

    // 2. 기수별 미션 수 및 제출 현황
    const { data: missions, error: missionsError } = await supabase.from('mission_notice').select(`
        id, 
        cohort, 
        week,
        mission_submit (
          id,
          student_id
        )
      `);

    if (missionsError) throw missionsError;

    // 기수별 데이터 집계
    const cohortMap = new Map<number, CohortDashboardData>();

    // 학생 수 집계
    const studentsByCohort = new Map<number, number>();
    (students || []).forEach((student) => {
      const count = studentsByCohort.get(student.cohort) || 0;
      studentsByCohort.set(student.cohort, count + 1);
    });

    // 미션 및 제출 데이터 집계
    (missions || []).forEach((mission) => {
      const cohort = mission.cohort;

      if (!cohortMap.has(cohort)) {
        const totalStudents = studentsByCohort.get(cohort) || 0;
        cohortMap.set(cohort, {
          cohort,
          totalStudents,
          totalMissions: 0,
          submissionRate: 0,
          activeStudents: totalStudents,
          status: 'active', // 기본값
          weeklySubmissions: [],
        });
      }

      const cohortData = cohortMap.get(cohort)!;
      cohortData.totalMissions++;

      // 주차별 제출 현황 집계
      const weeklyMap = new Map<number, Set<string>>();
      (mission.mission_submit || []).forEach((sub: any) => {
        if (!weeklyMap.has(mission.week)) {
          weeklyMap.set(mission.week, new Set());
        }
        weeklyMap.get(mission.week)!.add(sub.student_id);
      });

      // 주차별 데이터 업데이트
      const existingWeek = cohortData.weeklySubmissions.find((w) => w.week === mission.week);
      const submittedCount = weeklyMap.get(mission.week)?.size || 0;

      if (existingWeek) {
        existingWeek.submitted += submittedCount;
        existingWeek.total += cohortData.totalStudents;
        existingWeek.rate =
          existingWeek.total > 0 ? Math.round((existingWeek.submitted / existingWeek.total) * 100) : 0;
      } else {
        cohortData.weeklySubmissions.push({
          week: mission.week,
          submitted: submittedCount,
          total: cohortData.totalStudents,
          rate: cohortData.totalStudents > 0 ? Math.round((submittedCount / cohortData.totalStudents) * 100) : 0,
        });
      }
    });

    // 기수별 전체 제출률 계산
    cohortMap.forEach((cohortData, cohort) => {
      const totalExpected = cohortData.totalMissions * cohortData.totalStudents;
      const totalSubmitted = cohortData.weeklySubmissions.reduce((sum, w) => sum + w.submitted, 0);
      cohortData.submissionRate = totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

      // 주차별 데이터 정렬
      cohortData.weeklySubmissions.sort((a, b) => a.week - b.week);
    });

    console.log('기수별 데이터 조회 완료');

    return Array.from(cohortMap.values()).sort((a, b) => parseInt(a.cohort) - parseInt(b.cohort));
  } catch (error) {
    console.error('기수별 데이터 조회 오류:', error);
    throw new Error('기수별 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};
