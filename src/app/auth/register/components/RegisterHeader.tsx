import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function RegisterHeader() {
  return (
    <>
      {/* 뒤로 가기 버튼 */}
      <div className="mb-8 animate-slide-down">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors group backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>로그인으로 돌아가기</span>
        </Link>
      </div>

      {/* 헤더 */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-float shadow-2xl border border-white/20">
            <span className="text-4xl">🚀</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 animate-slide-down">회원가입</h1>
        <p className="text-white/80 text-lg animate-slide-up">하대표의 숏폼 수익화 부스트와 함께 시작하세요</p>
      </div>
    </>
  );
}