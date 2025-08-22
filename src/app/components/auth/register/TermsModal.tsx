'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export default function TermsModal({ isOpen, onClose, onAgree }: TermsModalProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  if (!isOpen) return null;

  const canAgree = agreedToTerms && agreedToPrivacy;

  const handleAgree = () => {
    if (canAgree) {
      onAgree();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">이용약관 및 개인정보처리방침</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 이용약관 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-lg font-semibold text-slate-900">
                이용약관 동의 (필수)
              </label>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto text-sm text-slate-600">
              <h4 className="font-semibold text-slate-900 mb-2">제1조 (목적)</h4>
              <p className="mb-3">본 약관은 유튜브 쇼츠 마케팅 아카데미에서 제공하는 교육 서비스의 이용조건 및 절차, 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              
              <h4 className="font-semibold text-slate-900 mb-2">제2조 (정의)</h4>
              <p className="mb-3">1. "서비스"라 함은 회사가 제공하는 모든 교육 콘텐츠 및 관련 서비스를 의미합니다.</p>
              <p className="mb-3">2. "이용자"라 함은 본 약관에 따라 서비스를 이용하는 회원을 말합니다.</p>
              
              <h4 className="font-semibold text-slate-900 mb-2">제3조 (약관의 효력과 변경)</h4>
              <p>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다. 회사는 필요에 따라 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있습니다.</p>
            </div>
          </div>

          {/* 개인정보처리방침 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="privacy"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="privacy" className="text-lg font-semibold text-slate-900">
                개인정보처리방침 동의 (필수)
              </label>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto text-sm text-slate-600">
              <h4 className="font-semibold text-slate-900 mb-2">1. 개인정보의 수집 및 이용목적</h4>
              <p className="mb-3">회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
              <p className="mb-3">- 회원 가입 의사의 확인, 회원제 서비스 제공에 따른 본인 식별·인증</p>
              <p className="mb-3">- 교육 서비스 제공 및 진도 관리</p>
              
              <h4 className="font-semibold text-slate-900 mb-2">2. 처리하는 개인정보의 항목</h4>
              <p className="mb-3">- 필수항목: 이름, 아이디, 비밀번호, 이메일, 닉네임</p>
              
              <h4 className="font-semibold text-slate-900 mb-2">3. 개인정보의 처리 및 보유기간</h4>
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleAgree}
            disabled={!canAgree}
            className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
              canAgree
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            동의하고 계속
          </button>
        </div>
      </div>
    </div>
  );
}