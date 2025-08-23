import { supabase } from '../../supabase/client';
import { Mission } from '../../types';

export const fetchMissions = async (): Promise<Mission[]> => {
  try {
    console.log('미션 데이터 조회 시작...');

    // 1단계: 기본 미션 데이터 가져오기
    const { data: missions, error: missionError } = await supabase
      .from('mission_notice')
      .select('*')
      .order('created_at', { ascending: false });

    if (missionError) {
      console.error('미션 데이터 조회 오류:', missionError);
      throw new Error(`미션 데이터를 불러오는 중 오류가 발생했습니다: ${missionError.message}`);
    }

    console.log('미션 데이터 조회 완료:', missions?.length || 0, '개');

    // 2단계: 각 미션별 제출 데이터 가져오기
    const missionsWithSubmissions = await Promise.all(
      (missions || []).map(async (mission) => {
        try {
          // 해당 미션의 제출 데이터 조회
          const { data: submissions, error: submissionError } = await supabase
            .from('mission_submissions')
            .select(
              `
              id,
              student_id,
              content,
              submitted_at,
              status
            `
            )
            .eq('mission_id', mission.id);

          if (submissionError) {
            console.error(`미션 ${mission.id} 제출 데이터 조회 오류:`, submissionError);
            return {
              ...mission,
              submissions: [],
            };
          }

          // 중복 제출 제거 (같은 학생의 최신 제출만 유지)
          const uniqueSubmissions = (submissions || []).reduce((acc: any[], curr: any) => {
            const existingIndex = acc.findIndex((sub) => sub.student_id === curr.student_id);
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

          // 3단계: 각 제출의 학생 정보 가져오기
          const submissionsWithStudentInfo = await Promise.all(
            uniqueSubmissions.map(async (submission) => {
              try {
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('name, nickname')
                  .eq('id', submission.student_id)
                  .single();

                if (profileError) {
                  console.error(`학생 ${submission.student_id} 정보 조회 오류:`, profileError);
                }

                // 학생 닉네임 표시
                const displayName = profile?.nickname || profile?.name || '알 수 없음';

                // 제출 시간을 더 상세히 표시
                const submittedDateTime = new Date(submission.submitted_at);
                const formattedTime = `${submittedDateTime.toLocaleDateString()} ${submittedDateTime.toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}`;

                return {
                  id: submission.id,
                  missionId: mission.id,
                  studentName: displayName,
                  studentId: submission.student_id,
                  submittedAt: formattedTime, // 날짜 + 시간
                  fileName: submission.content || submission.file_name || '내용 없음',
                  fileSize: '-', // 파일 크기 제거
                  status: submission.status,
                  grade: undefined, // TODO: 성적 테이블 연동
                  feedback: undefined, // TODO: 피드백 테이블 연동
                };
              } catch (error) {
                console.error('학생 정보 처리 오류:', error);
                const submittedDateTime = new Date(submission.submitted_at);
                const formattedTime = `${submittedDateTime.toLocaleDateString()} ${submittedDateTime.toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}`;

                return {
                  id: submission.id,
                  missionId: mission.id,
                  studentName: '알 수 없음',
                  studentId: submission.student_id,
                  submittedAt: formattedTime,
                  fileName: submission.content || submission.file_name || '내용 없음',
                  fileSize: '-', // 파일 크기 제거
                  status: submission.status,
                  grade: undefined,
                  feedback: undefined,
                };
              }
            })
          );

          console.log(`미션 ${mission.title}: ${submissionsWithStudentInfo.length}개 제출 처리 완료`);
          return {
            ...mission,
            submissions: submissionsWithStudentInfo,
          };
        } catch (error) {
          console.error(`미션 ${mission.id} 처리 오류:`, error);
          return {
            ...mission,
            submissions: [],
          };
        }
      })
    );

    console.log('제출 데이터 포함 미션 조회 완료');
    return missionsWithSubmissions;
  } catch (error) {
    console.error('미션 데이터 가져오기 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('미션 데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.');
  }
};

export const createMission = async (formData: any): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  // datetime-local 값을 UTC로 변환
  const processedFormData = { ...formData };
  if (formData.due_date) {
    // datetime-local 값은 로컬 시간대 기준이므로 UTC로 변환
    const localDate = new Date(formData.due_date);
    processedFormData.due_date = localDate.toISOString();
  }

  const { error } = await supabase.from('mission_notice').insert([
    {
      ...processedFormData,
      created_by: user.id,
    },
  ]);

  if (error) {
    console.error('미션 생성 오류:', error);
    console.error('전송된 데이터:', processedFormData);
    throw new Error(`미션 생성 중 오류가 발생했습니다: ${error.message}`);
  }
};

export const updateMission = async (missionId: string, formData: any): Promise<void> => {
  // datetime-local 값을 UTC로 변환
  const processedFormData = { ...formData };
  if (formData.due_date) {
    // datetime-local 값은 로컬 시간대 기준이므로 UTC로 변환
    const localDate = new Date(formData.due_date);
    processedFormData.due_date = localDate.toISOString();
  }

  const { error } = await supabase.from('mission_notice').update(processedFormData).eq('id', missionId);

  if (error) {
    console.error('미션 수정 오류:', error);
    throw new Error('미션 수정 중 오류가 발생했습니다.');
  }
};

export const deleteMission = async (missionId: string): Promise<void> => {
  const { error } = await supabase.from('mission_notice').delete().eq('id', missionId);

  if (error) {
    console.error('미션 삭제 오류:', error);
    throw new Error('미션 삭제 중 오류가 발생했습니다.');
  }
};
