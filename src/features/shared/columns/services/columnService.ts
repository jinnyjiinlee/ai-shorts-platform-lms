// api 서비스

import { supabase } from '@/lib/supabase/client';
import { Column, CreateColumnDto, UpdateColumnDto } from '@/types/domains/community';

export class ColumnService {
  // DB 데이터를 Column 타입으로 변환
  private static mapDbToColumn(dbData: any): Column {
    return {
      id: dbData.id,
      title: dbData.title,
      content: dbData.content,
      author: '하대표',
      author_id: dbData.admin_id,
      status: dbData.is_published ? 'published' : 'draft',
      is_featured: dbData.is_pinned || false,
      view_count: 0,
      like_count: 0,
      created_at: dbData.created_at,
      updated_at: dbData.updated_at,
      published_at: dbData.is_published ? dbData.created_at : undefined,
    };
  }

  // 모든 칼럼 조회 (발행된 것만, 고정 먼저, 최신순)
  static async getAll() {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(item => this.mapDbToColumn(item)) || [];
  }

  // 관리자용 - 모든 칼럼 조회 (상태 무관)
  static async getAllForAdmin() {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(item => this.mapDbToColumn(item)) || [];
  }

  // 칼럼 생성 (관리자/작가만) - 실제 테이블 구조에 맞춤
  static async create(dto: CreateColumnDto) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    const { data, error } = await supabase
      .from('columns')
      .insert([{ 
        title: dto.title,
        content: dto.content,
        admin_id: user.id,
        is_published: dto.status === 'published',
        is_pinned: dto.is_featured || false,
      }])
      .select()
      .single();

    if (error) throw error;
    
    // 반환 데이터를 내 타입 구조로 변환
    return this.mapDbToColumn(data);
  }

  // 칼럼 수정 (작성자/관리자만)
  static async update(id: string, dto: UpdateColumnDto) {
    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    const updateData: any = {};

    // 실제 테이블 필드로 매핑
    if (dto.title) updateData.title = dto.title;
    if (dto.content) updateData.content = dto.content;
    if (dto.status !== undefined) {
      updateData.is_published = dto.status === 'published';
    }
    if (dto.is_featured !== undefined) {
      updateData.is_pinned = dto.is_featured;
    }

    console.log('업데이트 데이터:', updateData, 'ID:', id, '사용자:', user.id);

    // upsert로 변경하여 권한 문제 해결
    const { data, error } = await supabase
      .from('columns')
      .upsert({ 
        id: id,
        ...updateData,
        admin_id: user.id // admin_id 포함
      })
      .select()
      .single();

    if (error) {
      console.error('칼럼 수정 오류:', error);
      throw error; // 실제 Supabase 에러를 그대로 던져서 더 자세한 정보 확인
    }
    
    return this.mapDbToColumn(data);
  }

  // 칼럼 삭제 (작성자/관리자만)
  static async delete(id: string) {
    const { error } = await supabase.from('columns').delete().eq('id', id);

    if (error) throw error;
  }

  // 특정 칼럼 조회
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapDbToColumn(data);
  }




}