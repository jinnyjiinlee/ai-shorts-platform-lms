// api 서비스

import { supabase } from '@/lib/supabase/client';
import { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from '@/types/domains/announcement';

export class AnnouncementService {
  // 모든 공지사항 조회 (고정 공지 먼저, 최신순)
  static async getAll() {
    const { data, error } = await supabase
      .from('announcements')
      .select(
        `
          *,
          profiles(name, nickname)
        `
      )
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 공지사항 생성 (관리자만)
  static async create(dto: CreateAnnouncementDto) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    const { data, error } = await supabase
      .from('announcements')
      .insert([{ ...dto, admin_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 공지사항 수정 (관리자만)
  static async update(id: string, dto: UpdateAnnouncementDto) {
    const { data, error } = await supabase
      .from('announcements')
      .upsert(
        {
          id,
          ...dto,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('공지사항 수정 오류:', error);
      throw new Error('공지사항 수정 중 오류가 발생했습니다.');
    }
    return data;
  }

  // 공지사항 삭제 (관리자만)
  static async delete(id: string) {
    const { error } = await supabase.from('announcements').delete().eq('id', id);

    if (error) throw error;
  }

  // 특정 공지사항 조회
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        profiles(name, nickname)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // 고정 상태 토글
  static async togglePinned(id: string) {
    // 현재 상태 확인
    const { data: current } = await supabase
      .from('announcements')
      .select('is_pinned')
      .eq('id', id)
      .single();

    if (!current) throw new Error('공지사항을 찾을 수 없습니다.');

    // 고정 상태 토글
    const { error } = await supabase
      .from('announcements')
      .update({ 
        is_pinned: !current.is_pinned,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  // 발행 상태 토글
  static async togglePublished(id: string) {
    // 현재 상태 확인
    const { data: current } = await supabase
      .from('announcements')
      .select('is_published')
      .eq('id', id)
      .single();

    if (!current) throw new Error('공지사항을 찾을 수 없습니다.');

    // 발행 상태 토글
    const { error } = await supabase
      .from('announcements')
      .update({ 
        is_published: !current.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }
}
