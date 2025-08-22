'use client';

import { useState } from 'react';
import { signIn } from '../../supabase/auth';
import { supabase } from '../../supabase/client';

interface LoginFormData {
  userId: string;
  password: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);

    try {
      // Supabase Auth로 로그인 (아이디 또는 이메일)
      const { data, error } = await signIn(formData.userId, formData.password);

      if (error) {
        const errorMessage = error instanceof Error ? error.message : '잘못된 아이디 또는 비밀번호입니다.';
        alert(errorMessage);
        setIsLoading(false);
        return false;
      }

      if (!data?.user) {
        alert('로그인에 실패했습니다.');
        setIsLoading(false);
        return false;
      }

      // 프로필 정보 가져오기
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      
      console.log('Profile data:', profile);
      console.log('Profile error:', profileError);

      if (!profile) {
        alert('프로필 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return false;
      }

      // 승인 상태 확인
      if (profile.status !== 'approved') {
        alert('관리자 승인을 기다리고 있습니다.');
        await supabase.auth.signOut();
        setIsLoading(false);
        return false;
      }

      // 로그인 상태 유지 처리
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30일
        localStorage.setItem('loginExpiration', expirationTime.toString());
      }

      // 역할 정보 저장
      localStorage.setItem('userType', profile.role);
      localStorage.setItem('userId', profile.user_id);
      localStorage.setItem('userName', profile.name || profile.nickname || profile.full_name || '사용자');

      // 역할에 따라 리다이렉트
      const userRole = profile.role;
      if (userRole === 'admin') {
        window.location.href = '/admin';
      }

      if (userRole === 'student') {
        window.location.href = '/student';
      }

      return true;
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    rememberMe,
    setRememberMe,
    handleLogin,
  };
}
