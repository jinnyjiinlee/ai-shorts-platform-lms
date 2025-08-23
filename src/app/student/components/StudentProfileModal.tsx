'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase/client';
import { useToast } from '@/features/ui/useToast';

interface StudentProfileModalProps {
  show: boolean;
  onClose: () => void;
  onProfileUpdate: (newName: string) => void;
}

export default function StudentProfileModal({ show, onClose, onProfileUpdate }: StudentProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    cohort: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    if (show) {
      loadUserProfile();
    }
  }, [show]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("로그인한 유저 id:", user?.id);

      if (user) {
        // 사용자 기본 정보
        setFormData((prev) => ({
          ...prev,
          email: user.email || '',
        }));

        // 프로필 정보
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, nickname, cohort')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            name: profile.name || '',
            nickname: profile.nickname || '',
            cohort: profile.cohort || 1,
          }));
        }
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      addToast('error', '오류', '프로필 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addToast('error', '입력 오류', '이름을 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: formData.name.trim(),
            nickname: formData.nickname.trim() || null,
          })
          .eq('id', user.id);

        if (error) {
          console.error('프로필 업데이트 오류:', error);
          addToast('error', '저장 실패', '프로필 저장 중 오류가 발생했습니다.');
          return;
        }

        addToast('success', '저장 완료', '프로필이 성공적으로 저장되었습니다.');
        // 닉네임이 있으면 닉네임 우선, 없으면 이름 사용
        onProfileUpdate(formData.nickname.trim() || formData.name.trim());
        onClose();
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      addToast('error', '저장 실패', '프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
        <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
          <div className='p-6 border-b border-slate-200'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
                  <span className='text-white text-lg'>👤</span>
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-slate-900'>프로필 수정</h3>
                  <p className='text-sm text-slate-600'>개인 정보를 수정하세요</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className='text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors'
              >
                <XMarkIcon className='w-6 h-6' />
              </button>
            </div>
          </div>

          <div className='p-6'>
            {isLoading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                <p className='text-slate-600'>프로필을 불러오는 중...</p>
              </div>
            ) : (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>이름 *</label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='이름을 입력하세요'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>별명</label>
                    <input
                      type='text'
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='별명을 입력하세요'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>이메일</label>
                    <div className='relative'>
                      <input
                        type='email'
                        value={formData.email}
                        disabled
                        className='w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500'
                      />
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        <svg className='w-4 h-4 text-slate-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                      </div>
                    </div>
                    <p className='text-xs text-slate-500 mt-1'>이메일은 변경할 수 없습니다.</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>기수</label>
                    <div className='w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium'>
                      {formData.cohort}기
                    </div>
                    <p className='text-xs text-slate-500 mt-1'>기수는 관리자가 설정합니다.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='p-6 border-t border-slate-200 bg-slate-50'>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors font-medium'
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className='px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm'
              >
                {isSaving ? (
                  <div className='flex items-center space-x-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    <span>저장 중...</span>
                  </div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <span>💾</span>
                    <span>저장하기</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
