'use client';

import RegisterForm from '@/features/auth/register/RegisterForm';
import TermsModal from '@/features/auth/register/TermsModal';
import RegisterBackground from './components/RegisterBackground';
import RegisterHeader from './components/RegisterHeader';
import RegisterFooter from './components/RegisterFooter';
import { useRegistration } from '../../../lib/hooks/auth/useRegistration';

export default function RegisterPage() {
  const {
    isLoading,
    agreedToTerms,
    showTermsModal,
    setAgreedToTerms,
    setShowTermsModal,
    handleSubmit
  } = useRegistration();

  const handleTermsAgree = () => {
    setAgreedToTerms(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background */}
      <RegisterBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <RegisterHeader />

        <div className="max-w-md mx-auto">
          {/* 회원가입 폼 */}
          <div className="relative animate-fade-in" style={{animationDelay: '300ms'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
            
              {/* 이용약관 동의 체크박스 */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms-agree"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-0.5"
                  />
                  <label htmlFor="terms-agree" className="text-sm text-slate-600">
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                    >
                      이용약관 및 개인정보처리방침
                    </button>에 동의합니다.
                  </label>
                </div>
              </div>
            </div>
          </div>

          <RegisterFooter />
        </div>
      </div>

      {/* 이용약관 모달 */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
      />
    </div>
  );
}