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
  submissionRate: number; // 평균 완료율
  perfectCompletionCount: number; // 모든 미션을 완료한 학생 수
  perfectCompletionRate: number; // 완벽 완료 비율
  participatingStudents: number; // 참여 학생 수 (하나라도 제출한 학생)
  currentWeek: number; // 현재 주차
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
      .select('id, cohort')
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
    const cohortMap = new Map<string, CohortDashboardData>();

    // 학생 수 집계
    const studentsByCohort = new Map<string, number>();
    (students || []).forEach((student) => {
      const count = studentsByCohort.get(student.cohort) || 0;
      studentsByCohort.set(student.cohort, count + 1);
    });

    // 기수별 주차별 미션 개수 계산
    const cohortWeeklyMissionCount = new Map<string, Map<number, number>>();
    // 학생별 주차별 제출 개수 계산
    const studentWeeklySubmissions = new Map<string, Map<number, number>>();

    // 미션 및 제출 데이터 집계
    (missions || []).forEach((mission) => {
      const cohort = mission.cohort || '1'; // null인 경우 기본값 '1' 사용

      if (!cohortMap.has(cohort)) {
        const totalStudents = studentsByCohort.get(cohort) || 0;
        cohortMap.set(cohort, {
          cohort,
          totalStudents,
          totalMissions: 0,
          submissionRate: 0,
          perfectCompletionCount: 0,
          perfectCompletionRate: 0,
          participatingStudents: 0,
          currentWeek: 0,
          activeStudents: totalStudents,
          status: 'active', // 기본값
          weeklySubmissions: [],
        });
      }

      const cohortData = cohortMap.get(cohort)!;
      cohortData.totalMissions++;

      // 기수별 주차별 미션 개수 카운트
      if (!cohortWeeklyMissionCount.has(cohort)) {
        cohortWeeklyMissionCount.set(cohort, new Map());
      }
      const weeklyMissionCount = cohortWeeklyMissionCount.get(cohort)!;
      const currentCount = weeklyMissionCount.get(mission.week) || 0;
      weeklyMissionCount.set(mission.week, currentCount + 1);

      // 각 제출에 대해 학생별 주차별 제출 개수 카운트
      (mission.mission_submit || []).forEach((sub: any) => {
        const studentId = sub.student_id;
        
        if (!studentWeeklySubmissions.has(studentId)) {
          studentWeeklySubmissions.set(studentId, new Map());
        }
        const studentWeekly = studentWeeklySubmissions.get(studentId)!;
        const currentSubmissions = studentWeekly.get(mission.week) || 0;
        studentWeekly.set(mission.week, currentSubmissions + 1);
      });
    });

    // 주차별 완료한 학생 수 계산
    cohortWeeklyMissionCount.forEach((weeklyMissionCount, cohort) => {
      const cohortData = cohortMap.get(cohort)!;
      
      weeklyMissionCount.forEach((missionCount, week) => {
        let completedStudents = 0;

        // 해당 기수의 모든 학생을 확인
        (students || []).forEach((student) => {
          if (student.cohort === cohort) {
            const studentSubmissions = studentWeeklySubmissions.get(student.id);
            const submissionCount = studentSubmissions?.get(week) || 0;
            
            // 해당 주차의 모든 미션을 완료했는지 확인
            if (submissionCount === missionCount) {
              completedStudents++;
            }
          }
        });

        cohortData.weeklySubmissions.push({
          week,
          submitted: completedStudents,
          total: cohortData.totalStudents,
          rate: cohortData.totalStudents > 0 ? Math.round((completedStudents / cohortData.totalStudents) * 100) : 0,
        });
      });
    });

    // 기수별 상세 통계 계산
    cohortMap.forEach((cohortData) => {
      const cohort = cohortData.cohort;
      const cohortStudents = (students || []).filter(s => s.cohort === cohort);
      
      // 개별 학생별 완료율 계산
      let totalCompletionRate = 0;
      let perfectCompletionCount = 0;
      let participatingStudentsSet = new Set<string>();

      cohortStudents.forEach(student => {
        const studentSubmissions = studentWeeklySubmissions.get(student.id);
        let studentCompletedMissions = 0;

        // 각 주차별로 확인
        cohortWeeklyMissionCount.get(cohort)?.forEach((missionCount, week) => {
          const submissionCount = studentSubmissions?.get(week) || 0;
          if (submissionCount === missionCount) {
            studentCompletedMissions++;
          }
          if (submissionCount > 0) {
            participatingStudentsSet.add(student.id);
          }
        });

        // 개별 학생 완료율
        const studentCompletionRate = cohortData.totalMissions > 0 
          ? (studentCompletedMissions / cohortData.totalMissions) * 100 
          : 0;
        
        totalCompletionRate += studentCompletionRate;

        // 모든 미션을 완료한 학생 카운트
        if (studentCompletionRate === 100) {
          perfectCompletionCount++;
        }
      });

      // 평균 완료율
      cohortData.submissionRate = cohortStudents.length > 0 
        ? Math.round(totalCompletionRate / cohortStudents.length) 
        : 0;

      // 완벽 완료 관련 통계
      cohortData.perfectCompletionCount = perfectCompletionCount;
      cohortData.perfectCompletionRate = cohortStudents.length > 0 
        ? Math.round((perfectCompletionCount / cohortStudents.length) * 100) 
        : 0;

      // 참여 학생 수
      cohortData.participatingStudents = participatingStudentsSet.size;

      // 현재 주차 (가장 최근 미션의 week)
      const weeks = Array.from(cohortWeeklyMissionCount.get(cohort)?.keys() || []);
      cohortData.currentWeek = weeks.length > 0 ? Math.max(...weeks) : 0;

      // 주차별 데이터 정렬
      cohortData.weeklySubmissions.sort((a, b) => a.week - b.week);
    });

    console.log('기수별 데이터 조회 완료');

    return Array.from(cohortMap.values()).sort((a, b) => a.cohort.localeCompare(b.cohort));
  } catch (error) {
    console.error('기수별 데이터 조회 오류:', error);
    throw new Error('기수별 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};
