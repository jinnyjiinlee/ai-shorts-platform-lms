'use client';

import ProfileHeader from './ProfileHeader';
import ProfileImageSection from './ProfileImageSection';
import ProfileForm from './ProfileForm';
import ProfileActions from './ProfileActions';
import { useProfileData } from './hooks/useProfileData';
import { useProfileSave } from './hooks/useProfileSave';

export default function ProfileManagement({ userRole }: any) {
  const { isLoading, formData, setFormData } = useProfileData();
  const { isSaving, showToast, handleSave } = useProfileSave(userRole, formData);

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <ProfileHeader userRole={userRole} />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <ProfileImageSection />
        <ProfileForm userRole={userRole} formData={formData} onInputChange={setFormData} />
      </div>
      <ProfileActions isSaving={isSaving} onSave={handleSave} showToast={showToast} />
    </div>
  );
}
