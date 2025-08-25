'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useProfileSave(userRole: string, formData: any) {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    if (!formData.nickname?.trim()) return alert('활동명을 입력해주세요.');
    if (!formData.phone?.trim()) return alert('휴대폰을 입력해주세요.');

    try {
      setIsSaving(true);

      // 1. 사용자 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return alert('로그인이 필요합니다.');

      // 2. 업데이트 데이터 준비
      const updateData: any = {};
      if (formData.nickname?.trim()) {
        updateData.nickname = formData.nickname.trim(); // 활동명 수정 저장
      }
      if (formData.phone?.trim()) {
        updateData.phone = formData.phone.trim(); // 휴대폰 수정 저장
      }

      console.log('업데이트 데이터:', updateData);

      // 3. upsert 방식으로 시도 (PATCH 대신 INSERT/UPDATE)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('upsert 실패, update로 재시도:', error);

        // 4. upsert 실패 시 일반 update로 재시도
        const { error: updateError } = await supabase.from('profiles').update(updateData).eq('id', user.id);

        if (updateError) throw updateError;
      }

      console.log('업데이트 성공:', data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e: any) {
      console.error('저장 오류:', e);
      alert(`저장 실패: ${e?.message || '알 수 없는 오류'}`);
    } finally {
      setIsSaving(false);
    }

    // To-Do: Refactor
    // 저장 후 페이지 새로 고침
    // 52-53줄을 이렇게 수정
    setTimeout(() => {
      setShowToast(false);
      window.location.reload(); // 새로고침
    }, 1000);
  };

  return { isSaving, showToast, handleSave };
}
