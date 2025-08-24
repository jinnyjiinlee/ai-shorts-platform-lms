import { useState, useEffect } from 'react';
import { Mission } from '@/features/student/mission/types';
import { fetchStudentMissions, getStudentCohort } from '../../services/missions/studentMissionService';

export const useStudentMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentCohort, setStudentCohort] = useState<number>(1);

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      const cohort = await getStudentCohort();
      setStudentCohort(cohort);
      
      const missionData = await fetchStudentMissions(cohort);
      setMissions(missionData);
    } catch (error) {
      console.error('미션 로드 오류:', error);
      alert(error instanceof Error ? error.message : '미션을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMissionsByWeek = () => {
    return missions.reduce((acc, mission) => {
      if (!acc[mission.week]) {
        acc[mission.week] = [];
      }
      acc[mission.week].push(mission);
      return acc;
    }, {} as Record<number, Mission[]>);
  };

  const getStats = () => {
    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.isSubmitted).length;
    const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    
    return {
      totalMissions,
      completedMissions,
      completionRate
    };
  };

  useEffect(() => {
    loadMissions();
  }, []);

  return {
    missions,
    isLoading,
    studentCohort,
    missionsByWeek: getMissionsByWeek(),
    stats: getStats(),
    refreshMissions: loadMissions
  };
};