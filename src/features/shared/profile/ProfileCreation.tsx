'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/features/shared/ui/Toast';
import ProfileHeader from './ProfileHeader';
import ProfileImageSection from './ProfileImageSection';
import ProfileForm from './ProfileForm';
import ProfileActions from './ProfileActions';

interface FormData {
  user_id: string;
  email: string;
  name: string;
  nickname: string;
  cohort: number;
  role: string;
  status: string;
  phone: string;
}

interface ProfileCreationProps {
  userRole?: 'admin' | 'student';
}

export default function ProfileCreation({ userRole = 'student' }: ProfileCreationProps) {
  const { addToast, ToastContainer } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user_id: '',
    email: '',
    phone: '',
    name: '',
    nickname: '',
    cohort: 0,
    role: userRole,
    status: 'pending',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addToast('실명을 입력해주세요.', 'error');
      return;
    }
    if (!formData.email.trim()) {
      addToast('이메일을 입력해주세요.', 'error');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .insert({
          name: formData.name.trim(),
          nickname: formData.nickname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: userRole,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // 성공 후 폼 초기화
      setFormData({
        user_id: '',
        email: '',
        phone: '',
        name: '',
        nickname: '',
        cohort: 0,
        role: userRole,
        status: 'pending',
      });
      
    } catch (error) {
      console.error('프로필 생성 오류:', error);
      addToast('프로필 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileHeader userRole={userRole} title="프로필 생성" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileImageSection />
        <ProfileForm 
          userRole={userRole} 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      </div>
      <ProfileActions 
        isSaving={saving} 
        onSave={handleSave} 
        showToast={showToast} 
        buttonText="생성"
      />
      <ToastContainer />
    </div>
  );
}