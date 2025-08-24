import { useState, useEffect } from 'react';
import { Mission } from './types';
import { fetchStudentMissions, getStudentCohort } from '../notice/missionService';


export function useStudentMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentCohort, setStudentCohort] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const refreshMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const cohort = await getStudentCohort();
      setStudentCohort(cohort);
      
      const missionData = await fetchStudentMissions(cohort);
      setMissions(missionData);
    } catch (err) {
      console.error('미션 데이터 로드 오류:', err);
      setError(err instanceof Error ? err.message : '미션을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMissions();
  }, []);

  // 주차별 미션 그룹핑
  const missionsByWeek = missions.reduce((acc: Record<string, Mission[]>, mission) => {
    const week = mission.week.toString();
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(mission);
    return acc;
  }, {});

  // 통계 계산 (ProgressCards와 호환되도록 수정)
  const completedCount = missions.filter(m => m.isSubmitted).length;
  const stats = {
    totalMissions: missions.length,
    completedMissions: completedCount,
    pending: missions.filter(m => !m.isSubmitted).length,
    completionRate: missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0
  };

  return {
    missions,
    isLoading,
    error,
    studentCohort,
    missionsByWeek,
    stats,
    refreshMissions
  };
}

