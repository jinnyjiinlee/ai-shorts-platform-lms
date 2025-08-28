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
