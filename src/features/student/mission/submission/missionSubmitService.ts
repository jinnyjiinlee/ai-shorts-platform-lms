import { supabase } from '@/lib/supabase/client';

export interface SubmitData {
  missionId: string; // missions/mission_notice.id (uuid)
  content: string;
}

/** 0) 로그인 유저 id 얻기 (없으면 에러) */
async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error('로그인이 필요합니다.');
  return userId;
}

/** 1) 기존 제출 존재 여부 (데이터는 안 가져오고 count만) */
export async function hasSubmitted(missionId: string) {
  const userId = await getUserId();
  const { count, error } = await supabase
    .from('mission_submit')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', userId)
    .eq('mission_id', missionId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

/** 2) 새 제출(INSERT) */
export async function createSubmit({ missionId, content }: SubmitData) {
  const userId = await getUserId();
  const { error } = await supabase.from('mission_submit').insert({
    mission_id: missionId,
    student_id: userId,
    content,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/** 3) 재제출(UPDATE) */
export async function upsertSubmit({ missionId, content }: SubmitData) {
  const userId = await getUserId();

  const { error } = await supabase.from('mission_submit').upsert(
    {
      mission_id: missionId,
      student_id: userId,
      content,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    },
    {
      onConflict: 'mission_id,student_id', // ⚠️ UNIQUE 제약 필요
    }
  );

  if (error) throw error;
}

/** 4) 한 함수로 묶기: 없으면 생성, 있으면 수정 */
export async function submitMission(data: SubmitData) {
  if (!data.missionId) throw new Error('missionId가 없습니다.');
  if (!data.content?.trim()) throw new Error('내용을 입력하세요.');

  const exists = await hasSubmitted(data.missionId);
  if (exists) {
    await upsertSubmit(data);
  } else {
    await createSubmit(data);
  }
}

/** 5) 기존 제출 내용 가져오기 (없으면 null) */
export async function getExistingSubmission(missionId: string) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('mission_submit')
    .select('content')
    .eq('mission_id', missionId)
    .eq('student_id', userId)
    .maybeSingle(); // 0건/1건 모두 안전
  if (error) throw error;
  return data?.content ?? null;
}

// 기존 코드

// import { supabase } from '@/lib/supabase/client';

// export interface SubmitData {
//   missionId: string; // missions/mission_notice.id (uuid)
//   content: string;
// }

// // 네트워크 연결 확인
// const checkNetworkConnection = async (): Promise<void> => {
//   try {
//     // Supabase 연결 테스트
//     const { error } = await supabase.from('profiles').select('id').limit(1);
//     if (error) {
//       console.error('Supabase 연결 오류:', error);
//       throw new Error('데이터베이스 연결에 문제가 있습니다.');
//     }
//   } catch (error) {
//     console.error('네트워크 확인 오류:', error);
//     throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
//   }
// };

// export const submitMission = async (data: SubmitData): Promise<void> => {
//   try {
//     // 사용자 확인
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//       throw new Error('로그인이 필요합니다.');
//     }

//     // 기존 제출이 있는지 확인
//     const { data: existing } = await supabase
//       .from('mission_submit')
//       .select('id')
//       .eq('student_id', user.id)
//       .eq('mission_id', data.missionId);

//     if (existing && existing.length > 0) {
//       // 재제출 → 업데이트
//       const { error } = await supabase
//         .from('mission_submit')
//         .update({
//           content: data.content,
//           status: 'submitted',
//           submitted_at: new Date().toISOString(),
//         })
//         .eq('student_id', user.id)
//         .eq('mission_id', data.missionId);

//       if (error) throw error;
//     } else {
//       // 첫 제출 → 새로 생성
//       const { error } = await supabase
//         .from('mission_submit')
//         .insert({
//           mission_id: data.missionId,
//           student_id: user.id,
//           content: data.content,
//           status: 'submitted',
//           submitted_at: new Date().toISOString(),
//         });

//       if (error) throw error;
//     }
//   } catch (error) {
//     console.error('미션 제출 오류:', error);
//     throw new Error('제출 중 오류가 발생했습니다.');
//   }
// };

// // 기존 제출 내용 조회
// export const getExistingSubmission = async (missionId: string): Promise<string | null> => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return null;

//     const { data, error } = await supabase
//       .from('mission_submit')
//       .select('content')
//       .eq('mission_id', missionId)
//       .eq('student_id', user.id)
//       .single();

//     if (error && error.code !== 'PGRST116') {
//       console.error('제출 내용 조회 오류:', error);
//       return null;
//     }

//     return data?.content || null;
//   } catch (error) {
//     console.error('제출 내용 조회 중 오류:', error);
//     return null;
//   }
// };

// export const checkSubmissionStatus = async (missionId: string): Promise<boolean> => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return false;

//     const { data, error } = await supabase
//       .from('mission_submit')
//       .select('id')
//       .eq('mission_id', missionId)
//       .eq('student_id', user.id)
//       .single();

//     if (error && error.code !== 'PGRST116') {
//       // PGRST116 = no rows found
//       console.error('제출 상태 확인 오류:', error);
//       return false;
//     }

//     return !!data;
//   } catch (error) {
//     console.error('제출 상태 확인 중 오류:', error);
//     return false;
//   }
// };
