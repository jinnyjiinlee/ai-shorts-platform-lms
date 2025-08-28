'use client';

import { useState, useEffect } from 'react';
import { getOptimizedMissionData, getCohortList } from '../model/mission.service';
import { WeeklyData, StudentSubmissionDetail } from '../types';

export function useMissionData(selectedCohort: string) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [availableCohorts, setAvailableCohorts] = useState<string[]>(['1']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<StudentSubmissionDetail[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<Map<string, Map<string, any>>>(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 기수 목록과 최적화된 미션 데이터를 병렬로 조회
        const [cohorts, missionData] = await Promise.all([getCohortList(), getOptimizedMissionData(Number(selectedCohort))]);

        setAvailableCohorts(cohorts.map(c => c.toString()));
        setWeeklyData(missionData.weeklyData);
        setAllStudents(missionData.allStudents);
        setStudentSubmissions(missionData.studentSubmissions);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCohort]);

  return {
    weeklyData,
    availableCohorts,
    isLoading,
    error,
    allStudents,
    studentSubmissions,
  };
}
