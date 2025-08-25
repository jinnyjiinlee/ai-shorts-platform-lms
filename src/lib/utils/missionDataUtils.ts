import { supabase } from '../supabase/client';

export async function fetchMissionsForCohort(cohort: number) {
  const { data: missions, error: missionError } = await supabase
    .from('mission_notice')
    .select('*')
    .eq('cohort', cohort)
    .order('week', { ascending: true });

  if (missionError) {
    console.error('미션 조회 오류:', missionError);
    throw new Error(`미션 데이터를 불러오는 중 오류가 발생했습니다: ${missionError.message}`);
  }

  return missions || [];
}

export async function fetchStudentsForCohort(cohort: number) {
  const { data: students, error: studentError } = await supabase
    .from('profiles')
    .select('id')
    .eq('cohort', cohort)
    .eq('role', 'student');

  if (studentError) {
    console.error('학생 조회 오류:', studentError);
    throw new Error(`학생 데이터를 불러오는 중 오류가 발생했습니다: ${studentError.message}`);
  }

  return students || [];
}

export async function fetchMissionSubmissionData(missionId: string) {
  const { data: submissions, error: submissionError } = await supabase
    .from('mission_submit')
    .select('id, student_id, submitted_at')
    .eq('mission_id', missionId);

  if (submissionError) {
    console.error(`미션 ${missionId} 제출 조회 오류:`, submissionError);
    return [];
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

  return uniqueSubmissions;
}

export function calculateMissionSubmissionRate(submittedCount: number, totalStudents: number): number {
  return totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;
}
