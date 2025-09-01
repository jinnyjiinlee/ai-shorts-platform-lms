// Supabase와 데이터 통신 로직을 분리해서 재사용성 향상

import { supabase } from '@/lib/supabase/client';
import { GrowthDiary, CreateGrowthDiaryDto, UpdateGrowthDiaryDto } from '@/types/domains/growthDiary';

export class GrowthDiaryService {
  static async getAll(cohort = '1') {
    const { data, error } = await supabase
      .from('growth_diary')
      .select(
        `
          *,
          profiles(name, nickname)
        `
      )
      .eq('cohort', cohort)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('growth_diary')
      .select(
        `
          *,
          profiles(name, nickname)
        `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(dto: CreateGrowthDiaryDto) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    const { data, error } = await supabase
      .from('growth_diary')
      .insert([
        {
          ...dto,
          student_id: user.id,
          cohort: dto.cohort || '1',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, dto: UpdateGrowthDiaryDto) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('growth_diary')
      .upsert({
        id,
        student_id: user.id,
        ...dto,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('일기 수정 오류:', error);
      throw new Error('일기 수정 중 오류가 발생했습니다. 본인의 일기만 수정 가능합니다.');
    }
    
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase.from('growth_diary').delete().eq('id', id);

    if (error) throw error;
  }
}
