import { useState, useEffect } from 'react';

interface WeeklyData {
  week: number;
  totalMissions: number;
  submissions: number;
  rate: number;
}

interface StudentSubmissionDetail {
  id: string;
  name: string;
  week: number;
  submitted: boolean;
}

export function useTrackingData(selectedCohort: number) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [availableCohorts, setAvailableCohorts] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<StudentSubmissionDetail[]>([]);

  const loadData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API calls when service is implemented
      setAvailableCohorts([1, 2, 3]);
      setWeeklyData([
        { week: 1, totalMissions: 3, submissions: 15, rate: 75 },
        { week: 2, totalMissions: 2, submissions: 12, rate: 80 },
      ]);
      setAllStudents([]);
    } catch (err) {
      console.error('Tracking data fetch error:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCohort]);

  return {
    weeklyData,
    availableCohorts,
    allStudents,
    isLoading,
    error,
    refreshData: loadData,
  };
}