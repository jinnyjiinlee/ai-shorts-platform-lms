//사용

import { supabase } from '@/lib/supabase/client';
import { AuthService, DatabaseService, ErrorService } from '@/lib/service';
import { dateUtils } from '@/lib/utils';

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

    // 🎯 공통 서비스 사용으로 중복 제거 및 병렬 처리
    const [students, pendingStudents, missions, submissions] = await Promise.all([
      getApprovedStudents(),
      getPendingStudents(),
      DatabaseService.getMissions(),
      DatabaseService.getSubmissions(),
    ]);

    // 🎯 계산 로직만 남김
    return calculateDashboardStats(students, pendingStudents, missions, submissions);
  } catch (error) {
    // 🎯 에러 처리 통합
    ErrorService.handleError(error, '대시보드 데이터를 불러오는 중 오류가 발생했습니다');
  }
};

// 기수별 상세 데이터 가져오기
export const fetchCohortData = async (): Promise<CohortDashboardData[]> => {
  try {
    console.log('기수별 데이터 조회 시작...');

    // 🎯 공통 서비스 사용 및 병렬 처리
    const [students, missions] = await Promise.all([getApprovedStudents(), getMissionsWithSubmissions()]);

    // 🎯 계산 로직을 별도 함수로 분리
    const cohortData = calculateCohortData(students, missions);

    console.log('기수별 데이터 조회 완료');
    return cohortData;
  } catch (error) {
    ErrorService.handleError(error, '기수별 데이터를 불러오는 중 오류가 발생했습니다');
  }
};

// 🎯 공통 데이터 조회 함수들 (중복 제거)
async function getApprovedStudents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, cohort')
    .eq('role', 'student')
    .eq('status', 'approved');

  if (error) ErrorService.handleError(error, '학생 데이터 조회 실패');
  return data || [];
}

async function getPendingStudents() {
  const { data, error } = await supabase.from('profiles').select('id').eq('role', 'student').eq('status', 'pending');

  if (error) ErrorService.handleError(error, '승인 대기 학생 조회 실패');
  return data || [];
}

async function getMissionsWithSubmissions() {
  const { data, error } = await supabase.from('mission_notice').select(`
      id, 
      cohort, 
      week,
      mission_submit (
        id,
        student_id
      )
    `);

  if (error) ErrorService.handleError(error, '미션 데이터 조회 실패');
  return data || [];
}

// 🎯 계산 로직 분리 (기존 로직 유지)
function calculateDashboardStats(
  students: any[],
  pendingStudents: any[],
  missions: any[],
  submissions: any[]
): DashboardStats {
  const totalActiveStudents = students.length;
  const pendingApprovals = pendingStudents.length;
  const totalActiveMissions = missions.length;

  // 제출률 계산 (중복 제출 제거)
  const uniqueSubmissions = new Map();
  submissions.forEach((sub) => {
    const key = `${sub.mission_id}-${sub.student_id}`;
    uniqueSubmissions.set(key, sub);
  });

  const totalExpectedSubmissions = totalActiveMissions * totalActiveStudents;
  const actualSubmissions = uniqueSubmissions.size;
  const averageSubmissionRate = dateUtils.calculateRate(actualSubmissions, totalExpectedSubmissions);

  console.log('대시보드 통계 조회 완료');

  return {
    totalActiveStudents,
    averageSubmissionRate,
    totalActiveMissions,
    activeStudentsCount: totalActiveStudents,
    pendingApprovals,
  };
}

function calculateCohortData(students: any[], missions: any[]): CohortDashboardData[] {
  const cohortMap = new Map<string, CohortDashboardData>();

  // 학생 수 집계
  const studentsByCohort = new Map<string, number>();
  students.forEach((student) => {
    const count = studentsByCohort.get(student.cohort) || 0;
    studentsByCohort.set(student.cohort, count + 1);
  });

  // 기수별 주차별 미션 개수 계산
  const cohortWeeklyMissionCount = new Map<string, Map<number, number>>();
  const studentWeeklySubmissions = new Map<string, Map<number, number>>();

  // 미션 및 제출 데이터 집계
  missions.forEach((mission) => {
    const cohort = mission.cohort || '1';

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
        status: 'active',
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
      students.forEach((student) => {
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
        rate: dateUtils.calculateRate(completedStudents, cohortData.totalStudents),
      });
    });
  });

  // 기수별 상세 통계 계산
  cohortMap.forEach((cohortData) => {
    const cohort = cohortData.cohort;
    const cohortStudents = students.filter((s) => s.cohort === cohort);

    // 개별 학생별 완료율 계산
    let totalCompletionRate = 0;
    let perfectCompletionCount = 0;
    const participatingStudentsSet = new Set<string>();

    cohortStudents.forEach((student) => {
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
      const studentCompletionRate =
        cohortData.totalMissions > 0 ? (studentCompletedMissions / cohortData.totalMissions) * 100 : 0;

      totalCompletionRate += studentCompletionRate;

      // 모든 미션을 완료한 학생 카운트
      if (studentCompletionRate === 100) {
        perfectCompletionCount++;
      }
    });

    // 평균 완료율
    cohortData.submissionRate = cohortStudents.length > 0 ? Math.round(totalCompletionRate / cohortStudents.length) : 0;

    // 완벽 완료 관련 통계
    cohortData.perfectCompletionCount = perfectCompletionCount;
    cohortData.perfectCompletionRate = dateUtils.calculateRate(perfectCompletionCount, cohortStudents.length);

    // 참여 학생 수
    cohortData.participatingStudents = participatingStudentsSet.size;

    // 현재 주차 (가장 최근 미션의 week)
    const weeks = Array.from(cohortWeeklyMissionCount.get(cohort)?.keys() || []);
    cohortData.currentWeek = weeks.length > 0 ? Math.max(...weeks) : 0;

    // 주차별 데이터 정렬
    cohortData.weeklySubmissions.sort((a, b) => a.week - b.week);
  });

  return Array.from(cohortMap.values()).sort((a, b) => a.cohort.localeCompare(b.cohort));
}
