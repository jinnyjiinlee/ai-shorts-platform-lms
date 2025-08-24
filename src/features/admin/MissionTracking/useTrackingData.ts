import { useState, useEffect } from 'react';
import {
  fetchMissionTrackingData,
  fetchAvailableCohorts,
  fetchMissionStudentDetails,
  WeeklyData,
  StudentSubmissionDetail,
} from './trackingService';

export function useTrackingData(selectedCohort: number) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [availableCohorts, setAvailableCohorts] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<StudentSubmissionDetail[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<Map<string, Map<string, any>>>(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cohorts = await fetchAvailableCohorts();
        setAvailableCohorts(cohorts);

        const data = await fetchMissionTrackingData(selectedCohort);
        setWeeklyData(data);

        if (data.length > 0) {
          const firstMission = data[0];
          const studentDetails = await fetchMissionStudentDetails(firstMission.missionId, selectedCohort);
          setAllStudents(studentDetails);

          const submissionMap = new Map<string, Map<string, any>>();

          for (const mission of data) {
            const missionStudents = await fetchMissionStudentDetails(mission.missionId, selectedCohort);
            const missionSubmissions = new Map<string, any>();

            missionStudents.forEach((student) => {
              missionSubmissions.set(student.studentId, {
                submitted: student.submissionStatus === 'submitted',
                content: student.submissionContent,
                submittedAt: student.submittedAt,
              });
            });

            submissionMap.set(mission.missionId, missionSubmissions);
          }

          setStudentSubmissions(submissionMap);
        }
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
