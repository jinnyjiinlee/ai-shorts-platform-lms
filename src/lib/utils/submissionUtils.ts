import { supabase } from '../supabase/client';

export async function fetchSubmissionsForMission(missionId: string) {
  const { data: submissions, error: submissionError } = await supabase
    .from('mission_submissions')
    .select(`
      id,
      student_id,
      submission_type,
      content,
      file_url,
      file_name,
      file_size,
      submitted_at,
      status
    `)
    .eq('mission_id', missionId);

  if (submissionError) {
    console.error(`미션 ${missionId} 제출 데이터 조회 오류:`, submissionError);
    return [];
  }

  return submissions || [];
}

export async function fetchStudentProfile(studentId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, nickname')
    .eq('id', studentId)
    .single();

  if (profileError) {
    console.error(`학생 ${studentId} 정보 조회 오류:`, profileError);
    return null;
  }

  return profile;
}

export function formatSubmissionData(submission: any, profile: any) {
  const displayName = profile?.nickname || profile?.name || '알 수 없음';
  const submittedDateTime = new Date(submission.submitted_at);
  const formattedTime = `${submittedDateTime.toLocaleDateString()} ${submittedDateTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;

  return {
    id: submission.id,
    missionId: submission.mission_id,
    studentName: displayName,
    studentId: submission.student_id,
    submittedAt: formattedTime,
    fileName: submission.file_name || (submission.content ? '제출 완료' : '제출 완료'),
    fileSize: '-',
    status: submission.status,
    grade: undefined,
    feedback: undefined
  };
}