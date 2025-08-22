import { supabase } from './client';
import { ProfileData } from './types';

export async function createProfile(profileData: ProfileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select();

  if (error) {
    console.error('프로필 저장 실패 - 상세 오류:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return { data: null, error };
  }

  console.log('프로필 저장 성공:', data);
  return { data, error: null };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('프로필 가져오기 오류:', error);
    return { data: null, error };
  }

  return { data, error: null };
}