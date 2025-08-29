'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/features/shared/ui/Toast';

export default function ProfileImageSection() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  // 랜덤 아바타 생성하고 바로 적용
  const generateAndSaveRandomAvatar = async () => {
    try {
      console.log('아바타 생성 시작...');
      setIsGenerating(true);

      // 랜덤 seed 생성
      const seed = Math.random().toString(36).substring(2, 10);
      const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=ffffff`;

      // 현재 로그인한 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      console.log('현재 사용자:', user);
      if (!user) throw new Error('로그인이 필요합니다.');

      // 먼저 해당 사용자의 프로필이 존재하는지 확인
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, user_id')
        .eq('id', user.id)
        .single();
      
      console.log('기존 프로필:', existingProfile, '체크 에러:', checkError);
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // DB에 avatar_url 업데이트 (프로필이 없으면 생성)
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: avatarUrl,
          user_id: user.user_metadata?.user_id || user.email?.split('@')[0] || 'user'
        })
        .eq('id', user.id);
      if (updateError) throw updateError;

      // 화면 상태 업데이트
      setProfileImage(avatarUrl);
      addToast('새 아바타가 생성되었습니다!', 'success');
      console.log('아바타 생성 완료:', avatarUrl);
    } catch (err) {
      console.error('아바타 생성 실패:', err);
      console.error('에러 상세:', JSON.stringify(err, null, 2));
      addToast('아바타 생성에 실패했습니다: ' + (err instanceof Error ? err.message : '알 수 없는 오류'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // 처음 로드될 때 DB에서 avatar_url 가져오기, 없으면 랜덤 아바타 생성
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (!error && profile?.avatar_url) {
          setProfileImage(profile.avatar_url);
        } else {
          // avatar_url이 비어있으면 랜덤 아바타 생성
          await generateAndSaveRandomAvatar();
        }
      } catch (error) {
        console.error('프로필 로딩 실패:', error);
      }
    };

    loadProfileImage();
  }, []);

  // 아바타 선택 UI
  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">프로필 아바타</h2>
      
      <div className="flex flex-col items-center space-y-6">
        {/* 현재 선택된 아바타 미리보기 */}
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl border-4 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
            {isGenerating ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircleIcon className="w-20 h-20 text-slate-400" />
            )}
          </div>
        </div>

        {/* 새 아바타 생성 버튼 */}
        <button
          onClick={generateAndSaveRandomAvatar}
          disabled={isGenerating}
          className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">새 아바타 생성</span>
        </button>

        <p className="text-sm text-slate-500 text-center">
          마음에 드는 아바타가 나올 때까지 "새 아바타 생성" 버튼을 눌러보세요
        </p>
      </div>
    </div>
  );
}