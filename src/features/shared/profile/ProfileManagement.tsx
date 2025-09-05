'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/features/shared/ui/Toast';
import ProfileHeader from './ProfileHeader';
import ProfileImageSection from './ProfileImageSection';
import ProfileForm from './ProfileForm';
import ProfileActions from './ProfileActions';

interface ProfileFormData {
  user_id: string;
  email: string;
  name: string;
  nickname: string;
  cohort: number;
  role: string;
  status: string;
  phone: string;
}

interface ProfileManagementProps {
  userRole?: 'admin' | 'student';
}

export default function ProfileManagement({ userRole = 'student' }: ProfileManagementProps) {
  const { addToast, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    user_id: '',
    email: '',
    phone: '',
    name: '',
    nickname: '',
    cohort: 0,
    role: '',
    status: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (profileData) {
        setFormData({
          user_id: profileData.user_id || '',
          email: profileData.email || user.email || '',
          name: profileData.name || '',
          nickname: profileData.nickname || '',
          phone: profileData.phone || '',
          cohort: profileData.cohort || 0,
          role: profileData.role || userRole,
          status: profileData.status || '',
        });
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      addToast('프로필을 불러오는 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addToast('이름을 입력해주세요.', 'error');
      return;
    }

    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name.trim(),
          nickname: formData.nickname.trim(),
          phone: formData.phone.trim(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      // 로컬 스토리지 업데이트
      const displayName = formData.nickname.trim() || formData.name.trim();
      localStorage.setItem('userName', displayName);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      addToast('프로필 업데이트 중 오류가 발생했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <ProfileHeader userRole={userRole} />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <ProfileImageSection />
        <ProfileForm userRole={userRole} formData={formData} onInputChange={handleInputChange} />
      </div>
      <ProfileActions isSaving={saving} onSave={handleSave} showToast={showToast} />
      <ToastContainer />
    </div>
  );
}
