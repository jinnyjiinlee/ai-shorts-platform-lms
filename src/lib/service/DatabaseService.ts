import { supabase } from '@/lib/supabase/client';

export class DatabaseService {
  static async getMissions(cohort?: string) {
    let query = supabase.from('mission_notice').select('*').order('week', { ascending: true });

    if (cohort) {
      query = query.eq('cohort', cohort);
    }

    const { data, error } = await query;
    if (error) throw new Error('미션 목록 조회 실패');
    return data || [];
  }

  static async getSubmissions(missionId?: string, studentId?: string) {
    let query = supabase.from('mission_submit').select('*').order('submitted_at', { ascending: false });

    if (missionId) query = query.eq('mission_id', missionId);
    if (studentId) query = query.eq('student_id', studentId);

    const { data, error } = await query;
    if (error) throw new Error('제출 목록 조회 실패');
    return data || [];
  }
}
