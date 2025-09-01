// api 서비스

import { supabase } from '@/lib/supabase/client';
import { Column, CreateColumnDto, UpdateColumnDto } from '@/types/domains/community';

export class ColumnService {
  // 모든 칼럼 조회 (추천 칼럼 먼저, 최신순)
  static async getAll() {
    const { data, error } = await supabase
      .from('columns')
      .select(
        `
          *,
          profiles(name, nickname)
        `
      )
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 관리자용 - 모든 칼럼 조회 (상태 무관)
  static async getAllForAdmin() {
    const { data, error } = await supabase
      .from('columns')
      .select(
        `
          *,
          profiles(name, nickname)
        `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 칼럼 생성 (관리자/작가만)
  static async create(dto: CreateColumnDto) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    const { data, error } = await supabase
      .from('columns')
      .insert([{ 
        ...dto, 
        author_id: user.id,
        slug: dto.slug || dto.title.toLowerCase().replace(/\s+/g, '-'),
        published_at: dto.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 칼럼 수정 (작성자/관리자만)
  static async update(id: string, dto: UpdateColumnDto) {
    const updateData: any = {
      id,
      ...dto,
      updated_at: new Date().toISOString(),
    };

    // 발행 상태가 변경된 경우 published_at 업데이트
    if (dto.status === 'published') {
      updateData.published_at = new Date().toISOString();
    } else if (dto.status === 'draft') {
      updateData.published_at = null;
    }

    const { data, error } = await supabase
      .from('columns')
      .upsert(updateData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('칼럼 수정 오류:', error);
      throw new Error('칼럼 수정 중 오류가 발생했습니다.');
    }
    return data;
  }

  // 칼럼 삭제 (작성자/관리자만)
  static async delete(id: string) {
    const { error } = await supabase.from('columns').delete().eq('id', id);

    if (error) throw error;
  }

  // 특정 칼럼 조회 (슬러그 또는 ID로)
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('columns')
      .select(`
        *,
        profiles(name, nickname)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // 슬러그로 칼럼 조회
  static async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('columns')
      .select(`
        *,
        profiles(name, nickname)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data;
  }

  // 추천 칼럼 토글
  static async toggleFeatured(id: string) {
    // 현재 상태 확인
    const { data: current } = await supabase
      .from('columns')
      .select('is_featured')
      .eq('id', id)
      .single();

    if (!current) throw new Error('칼럼을 찾을 수 없습니다.');

    // 추천 상태 토글
    const { error } = await supabase
      .from('columns')
      .update({ 
        is_featured: !current.is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  // 발행 상태 변경
  static async updateStatus(id: string, status: 'draft' | 'published' | 'archived') {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    } else if (status === 'draft') {
      updateData.published_at = null;
    }

    const { error } = await supabase
      .from('columns')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  // 조회수 증가
  static async incrementViewCount(id: string) {
    const { error } = await supabase.rpc('increment_column_view_count', {
      column_id: id
    });

    if (error) console.error('조회수 업데이트 실패:', error);
  }

  // 좋아요 토글
  static async toggleLike(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('인증되지 않은 사용자입니다.');

    // 이미 좋아요했는지 확인
    const { data: existingLike } = await supabase
      .from('column_likes')
      .select('id')
      .eq('column_id', id)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // 좋아요 취소
      const { error } = await supabase
        .from('column_likes')
        .delete()
        .eq('column_id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return false;
    } else {
      // 좋아요 추가
      const { error } = await supabase
        .from('column_likes')
        .insert([{ column_id: id, user_id: user.id }]);

      if (error) throw error;
      return true;
    }
  }

  // 카테고리별 칼럼 조회
  static async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('columns')
      .select(`
        *,
        profiles(name, nickname),
        column_category_relations!inner(
          column_categories(name, slug)
        )
      `)
      .eq('column_category_relations.category_id', categoryId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 태그별 칼럼 조회
  static async getByTag(tagId: string) {
    const { data, error } = await supabase
      .from('columns')
      .select(`
        *,
        profiles(name, nickname),
        column_tag_relations!inner(
          column_tags(name, slug)
        )
      `)
      .eq('column_tag_relations.tag_id', tagId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}