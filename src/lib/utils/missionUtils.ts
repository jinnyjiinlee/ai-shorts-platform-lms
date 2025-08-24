import { Mission, WeeklyProgress } from '@/features/missions/admin/types';
// Mock student counts for different cohorts
const studentCounts: { [key: number]: number } = {
  1: 20,
  2: 25,
  3: 18,
  4: 22
};

// 주차별 미션 완료도 계산 함수 (Supabase 스키마 적용 시 추후 구현)
export const getWeeklyProgress = (missions: Mission[]): { [week: number]: WeeklyProgress } => {
  // 간단히 빈 객체 반환 (실제로는 submissions 테이블과 연계 필요)
  return {};
};

// 현재 진행 주차 계산 (Supabase 스키마에 맞게 간소화)
export const getCurrentWeek = (missions: Mission[]): number => {
  return 1; // 간단히 1주차로 고정 (실제로는 더 복잡한 로직 필요)
};

// 필터된 미션 목록 가져오기
export const getFilteredMissions = (missions: Mission[], selectedCohort: number | 'all'): Mission[] => {
  if (selectedCohort === 'all') return missions;
  return missions.filter(mission => mission.cohort === selectedCohort);
};

// 전체 기수 목록 가져오기
export const getAvailableCohorts = (missions: Mission[]): number[] => {
  const cohorts = [...new Set(missions.map(mission => mission.cohort).filter(Boolean))];
  return cohorts.sort();
};

// 총 제출 수 계산
export const getTotalSubmissions = (missions: Mission[]): number => {
  return missions.reduce((total, mission) => total + (mission.submissions?.length || 0), 0);
};

// 제출률 계산
export const getSubmissionRate = (missions: Mission[]): number => {
  if (missions.length === 0) return 0;
  
  let totalExpected = 0;
  let totalSubmitted = 0;
  
  missions.forEach(mission => {
    const cohort = mission.cohort || 1;
    const expectedStudents = studentCounts[cohort as keyof typeof studentCounts] || 0;
    totalExpected += expectedStudents;
    totalSubmitted += (mission.submissions?.length || 0);
  });
  
  return totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;
};

// 활동 수강생 수 계산
export const getActiveStudents = (missions: Mission[]): number => {
  const studentIds = new Set();
  
  missions.forEach(mission => {
    mission.submissions?.forEach(sub => {
      studentIds.add(sub.studentId);
    });
  });
  
  return studentIds.size;
};