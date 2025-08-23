import { supabase } from '../../supabase/client';

export interface SubmissionData {
  missionId: string;
  content: string;
}

// 네트워크 연결 확인
const checkNetworkConnection = async (): Promise<void> => {
  try {
    // Supabase 연결 테스트
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.error('Supabase 연결 오류:', error);
      throw new Error('데이터베이스 연결에 문제가 있습니다.');
    }
  } catch (error) {
    console.error('네트워크 확인 오류:', error);
    throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
  }
};

export const submitMission = async (data: SubmissionData): Promise<void> => {
  try {
    // 먼저 네트워크 연결 확인
    await checkNetworkConnection();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 기존 제출물이 있는지 확인
    const { data: existingSubmission, error: checkError } = await supabase
      .from('mission_submissions')
      .select('id')
      .eq('mission_id', data.missionId)
      .eq('student_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('기존 제출물 확인 오류:', checkError);
      throw new Error('제출 상태 확인 중 오류가 발생했습니다.');
    }

    let error;
    
    if (existingSubmission) {
      // 재제출: 기존 제출물 업데이트
      const { error: updateError } = await supabase
        .from('mission_submissions')
        .update({
          content: data.content,
          status: 'submitted',
          submitted_at: new Date().toISOString() // 제출 시간 업데이트
        })
        .eq('id', existingSubmission.id);
      
      error = updateError;
    } else {
      // 첫 제출: 새로운 레코드 생성
      const { error: insertError } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: data.missionId,
          student_id: user.id,
          content: data.content,
          status: 'submitted'
        });
      
      error = insertError;
    }

    if (error) {
      console.error('제출 저장 오류 (전체):', JSON.stringify(error, null, 2));
      
      // 네트워크 오류 확인
      if (error.message && error.message.includes('Failed to fetch')) {
        throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
      }
      
      // 좀 더 구체적인 오류 메시지 제공
      if (error.code === '23505') {
        throw new Error('이미 제출된 미션입니다. 다시 제출하려면 기존 제출물을 수정해주세요.');
      } else if (error.code === '42501') {
        throw new Error('제출 권한이 없습니다. 관리자에게 문의해주세요.');
      } else if (error.message) {
        throw new Error(`제출 저장 오류: ${error.message}`);
      } else {
        throw new Error('제출 저장 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  } catch (error) {
    console.error('미션 제출 오류:', error);
    
    // 네트워크 관련 오류들 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
    }
    
    if (error instanceof Error) {
      // 일반적인 네트워크 오류 메시지들
      if (error.message.includes('network') || 
          error.message.includes('timeout') || 
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND')) {
        throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
      }
      throw error;
    }
    
    throw new Error('미션 제출 중 예상치 못한 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
  }
};

export const checkSubmissionStatus = async (missionId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('mission_submissions')
      .select('id')
      .eq('mission_id', missionId)
      .eq('student_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('제출 상태 확인 오류:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('제출 상태 확인 중 오류:', error);
    return false;
  }
};