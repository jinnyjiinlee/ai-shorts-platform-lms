import { WeeklyData, StudentSubmissionDetail } from '../types';

/**
 * 학생별 제출 통계 계산
 */
export const calculateStudentStats = (
  student: StudentSubmissionDetail,
  weeklyData: WeeklyData[],
  studentSubmissions: Map<string, Map<string, any>>
) => {
  let submittedCount = 0;

  weeklyData.forEach((week) => {
    const missionSubmissions = studentSubmissions.get(week.missionId);
    const submission = missionSubmissions?.get(student.studentId);
    if (submission?.submitted) {
      submittedCount++;
    }
  });

  const submissionRate = weeklyData.length > 0 ? Math.round((submittedCount / weeklyData.length) * 100) : 0;

  return {
    submittedCount,
    submissionRate,
    totalMissions: weeklyData.length,
  };
};

/**
 * 전체 통계 계산
 */
export const calculateOverallStats = (weeklyData: WeeklyData[]) => {
  const totalSubmissions = weeklyData.reduce((sum, week) => sum + week.submittedCount, 0);
  const totalExpected = weeklyData.reduce((sum, week) => sum + week.totalStudents, 0);
  const overallRate = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0;

  return {
    totalSubmissions,
    totalExpected,
    overallRate,
  };
};

/**
 * 학생의 특정 주차 제출 정보 가져오기
 */
export const getStudentSubmissionForWeek = (
  studentId: string,
  weekMissionId: string,
  studentSubmissions: Map<string, Map<string, any>>
) => {
  const missionSubmissions = studentSubmissions.get(weekMissionId);
  const submission = missionSubmissions?.get(studentId);
  return {
    hasSubmission: submission?.submitted || false,
    content: submission?.content || '제출 내용이 없습니다.',
    submittedAt: submission?.submittedAt || '제출일 정보 없음',
    submissionId: submission?.submissionId || null,
    hasFeedback: submission?.hasFeedback || false,
  };
};
