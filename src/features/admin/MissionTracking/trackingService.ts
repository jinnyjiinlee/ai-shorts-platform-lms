import { supabase } from '../../../lib/supabase/client';
import {
  fetchMissionsForCohort,
  fetchStudentsForCohort,
  fetchMissionSubmissionData,
  calculateMissionSubmissionRate,
} from '../../../lib/utils/missionDataUtils';

export interface WeeklyData {
  week: number;
  missionTitle: string;
  missionId: string;
  totalStudents: number;
  submittedCount: number;
  submissionRate: number;
  dueDate: string;
}

export const fetchMissionTrackingData = async (cohort: number): Promise<WeeklyData[]> => {
  try {
    console.log('미션 달성 데이터 조회 시작...');

    const missions = await fetchMissionsForCohort(cohort);
    const students = await fetchStudentsForCohort(cohort);

    console.log(`${cohort}기 미션 ${missions.length}개, 학생 ${students.length}명 조회`);

    const trackingData: WeeklyData[] = await Promise.all(
      missions.map(async (mission) => {
        try {
          const submissions = await fetchMissionSubmissionData(mission.id);
          const submittedCount = submissions.length; // 이미 중복 제거된 데이터
          const submissionRate = calculateMissionSubmissionRate(submittedCount, students.length);

          return {
            week: mission.week,
            missionTitle: mission.title,
            missionId: mission.id,
            totalStudents: students.length,
            submittedCount,
            submissionRate,
            dueDate: mission.due_date,
          };
        } catch (error) {
          console.error(`미션 ${mission.title} 처리 오류:`, error);
          return {
            week: mission.week,
            missionTitle: mission.title,
            missionId: mission.id,
            totalStudents: students.length,
            submittedCount: 0,
            submissionRate: 0,
            dueDate: mission.due_date,
          };
        }
      })
    );

    console.log('미션 달성 데이터 조회 완료');
    return trackingData.sort((a, b) => a.week - b.week);
  } catch (error) {
    console.error('미션 달성 데이터 조회 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('미션 달성 데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.');
  }
};

// 사용 가능한 기수 목록 가져오기
export const fetchAvailableCohorts = async (): Promise<number[]> => {
  try {
    const { data: missions, error } = await supabase
      .from('mission_notice')
      .select('cohort')
      .order('cohort', { ascending: true });

    if (error) {
      console.error('기수 목록 조회 오류:', error);
      return [1]; // 기본값
    }

    // 중복 제거
    const uniqueCohorts = [...new Set(missions?.map((m) => m.cohort) || [])];
    return uniqueCohorts.length > 0 ? uniqueCohorts : [1];
  } catch (error) {
    console.error('기수 목록 조회 오류:', error);
    return [1]; // 기본값
  }
};

// 학생별 상세 제출 정보
export interface StudentSubmissionDetail {
  studentId: string;
  studentName: string;
  submissionStatus: 'submitted' | 'not_submitted';
  submittedAt?: string;
  submissionContent?: string;
  grade?: number;
  feedback?: string;
}

// 미션별 학생 상세 현황 가져오기
export const fetchMissionStudentDetails = async (
  missionId: string,
  cohort: number
): Promise<StudentSubmissionDetail[]> => {
  try {
    // 1. 해당 기수의 모든 학생 가져오기
    const { data: students, error: studentError } = await supabase
      .from('profiles')
      .select('id, name, nickname')
      .eq('cohort', cohort)
      .eq('role', 'student');

    if (studentError) {
      console.error('학생 목록 조회 오류:', studentError);
      throw new Error(`학생 데이터를 불러오는 중 오류가 발생했습니다: ${studentError.message}`);
    }

    // 2. 해당 미션의 제출 내역 가져오기
    const { data: submissions, error: submissionError } = await supabase
      .from('mission_submissions')
      .select('student_id, submitted_at, status, content')
      .eq('mission_id', missionId);

    if (submissionError) {
      console.error('제출 내역 조회 오류:', submissionError);
      throw new Error(`제출 데이터를 불러오는 중 오류가 발생했습니다: ${submissionError.message}`);
    }

    // 중복 제출 제거 (같은 학생의 최신 제출만 유지)
    const uniqueSubmissions = (submissions || []).reduce((acc: any[], curr: any) => {
      const existingIndex = acc.findIndex((sub: any) => sub.student_id === curr.student_id);
      if (existingIndex >= 0) {
        // 더 최신 제출로 교체
        if (new Date(curr.submitted_at) > new Date(acc[existingIndex].submitted_at)) {
          acc[existingIndex] = curr;
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    // 3. 학생별 제출 상태 매핑
    const submissionMap = new Map(
      uniqueSubmissions.map((sub) => [
        sub.student_id,
        {
          submittedAt: sub.submitted_at,
          status: sub.status,
          content: sub.content,
        },
      ])
    );

    // 4. 결과 생성
    return (students || []).map((student) => {
      const submission = submissionMap.get(student.id);
      const displayName = student.nickname || student.name || '알 수 없음';

      return {
        studentId: student.id,
        studentName: displayName,
        submissionStatus: submission ? 'submitted' : 'not_submitted',
        submittedAt: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString('ko-KR') : undefined,
        submissionContent: submission?.content || '',
      };
    });
  } catch (error) {
    console.error('학생 상세 현황 조회 오류:', error);
    throw error;
  }
};
