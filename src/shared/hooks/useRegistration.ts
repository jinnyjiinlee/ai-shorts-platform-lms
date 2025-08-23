import { useState } from 'react';
import { ValidationUtils } from '@/shared/utils/validationUtils';
import { authHelpers, UserRegistrationData } from '@/shared/services';

interface RegisterFormData {
  userId: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  cohort: number;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateForm = (formData: RegisterFormData) => {
    const validations = [
      { error: ValidationUtils.validateUserId(formData.userId), field: 'userId' },
      { error: ValidationUtils.validateEmail(formData.email), field: 'email' },
      { error: ValidationUtils.validatePassword(formData.password), field: 'password' },
      {
        error: ValidationUtils.validateConfirmPassword(formData.password, formData.confirmPassword),
        field: 'confirmPassword',
      },
    ];

    for (const { error } of validations) {
      if (error) {
        alert(error);
        return false;
      }
    }
    return true;
  };

  const getErrorMessage = (error: any) => {
    if (error.message?.includes('User already registered')) {
      return '이미 가입된 이메일입니다.';
    }
    if (error.message?.includes('Password')) {
      return '비밀번호가 너무 약합니다. (8자 이상 입력해주세요)';
    }
    if (error.message?.includes('Invalid email')) {
      return '올바르지 않은 이메일 형식입니다.';
    }
    if (error.message?.includes('duplicate key')) {
      return '이미 사용 중인 사용자 ID입니다.';
    }
    if (error.message?.includes('For security purposes')) {
      return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
    }
    return '회원가입 중 오류가 발생했습니다.';
  };

  const handleSubmit = async (formData: RegisterFormData) => {

    if (!agreedToTerms) {
      setShowTermsModal(true);
      return;
    }

    setIsLoading(true);

    try {
      if (!validateForm(formData)) {
        setIsLoading(false);
        return;
      }

      // 1. 랜덤 아바타 seed 생성
      const seed = Math.random().toString(36).substring(2, 10);

      // 2. Dicebear 아바타 URL 만들기
      const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;

      const registrationData: UserRegistrationData = {
        userId: formData.userId,
        nickname: formData.nickname,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        cohort: formData.cohort,
        avatar_url: avatarUrl,
      };

      const { data, error } = await authHelpers.signUp(registrationData);

      if (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Registration error:', error);
        alert(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data?.user?.identities?.length === 0) {
        alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
        setIsLoading(false);
        return;
      }

      alert(
        `회원가입이 완료되었습니다!\n\n${formData.email}로 인증 메일을 발송했습니다.\n이메일을 확인해주세요.\n\n(스팸 메일함도 확인해주세요)`
      );
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      alert('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    agreedToTerms,
    showTermsModal,
    setAgreedToTerms,
    setShowTermsModal,
    handleSubmit,
  };
}
