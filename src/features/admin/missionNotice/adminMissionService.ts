import { supabase } from '@/lib/supabase/client';

interface MissionFormData {
  title: string;
  description: string;
  due_date: string;
  cohort: string;
  week: number;
}
import { Mission } from '@/types/domains/mission';

export const fetchMissions = async (): Promise<Mission[]> => {
  try {
    console.log('미션 데이터 조회 시작...');

    // 1. 미션 기본 정보 조회
    const { data: missions, error: missionError } = await supabase
      .from('mission_notice')
      .select('*')
      .order('created_at', { ascending: false });

    if (missionError) {
      console.error('미션 데이터 조회 오류:', missionError);
      throw new Error(`미션 데이터를 불러오는 중 오류가 발생했습니다: ${missionError.message}`);
    }

    if (!missions || missions.length === 0) {
      return [];
    }

    console.log('미션 데이터 조회 완료:', missions.length, '개');

    // 2. 작성자 UUID들 추출
    const authorIds = [...new Set(missions.map(mission => mission.created_by).filter(Boolean))];
    
    // 3. 작성자들의 닉네임 조회
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, nickname')
      .in('id', authorIds);

    if (profileError) {
      console.error('작성자 정보 조회 오류:', profileError);
      // 프로필 조회 실패해도 미션은 반환 (닉네임만 '관리자'로 표시)
    }

    // 4. UUID to nickname 매핑 객체 생성
    const nicknameMap = new Map();
    (profiles || []).forEach(profile => {
      nicknameMap.set(profile.id, profile.nickname);
    });

    // 5. 미션에 닉네임 추가
    const mappedMissions = missions.map(mission => ({
      ...mission,
      authorNickname: nicknameMap.get(mission.created_by) || '관리자'
    }));
    
    return mappedMissions;
  } catch (error) {
    console.error('미션 데이터 가져오기 오류:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('미션 데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.');
  }
};

export const createMission = async (formData: MissionFormData): Promise<void> => {
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

  // 디버깅: cohort 값 확인
  console.log('미션 생성 데이터:', processedFormData);
  console.log('cohort 값:', processedFormData.cohort, '타입:', typeof processedFormData.cohort);

  // cohort가 비어있으면 기본값 설정

  if (!processedFormData.cohort) {
    processedFormData.cohort = '1'; // 기본값
    console.warn('cohort 값이 없어서 기본값 "1"로 설정');
  }

  const insertData = {
    ...processedFormData,
    created_by: user.id,
  };

  console.log('최종 INSERT 데이터:', insertData);

  const { error } = await supabase.from('mission_notice').insert([insertData]);

  if (error) {
    console.error('미션 생성 오류:', error);
    console.error('전송된 데이터:', insertData);
    throw new Error(`미션 생성 중 오류가 발생했습니다: ${error.message}`);
  }
};

export const updateMission = async (missionId: string, formData: MissionFormData): Promise<void> => {
  // datetime-local 값을 UTC로 변환
  const processedFormData = { ...formData, id: missionId };
  if (formData.due_date) {
    // datetime-local 값은 로컬 시간대 기준이므로 UTC로 변환
    const localDate = new Date(formData.due_date);
    processedFormData.due_date = localDate.toISOString();
  }

  const { error } = await supabase.from('mission_notice').upsert(processedFormData);

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
