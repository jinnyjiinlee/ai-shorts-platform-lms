import Link from 'next/link';

export default function RegisterFooter() {
  return (
    <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '600ms'}}>
      <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
        <p className="text-white/90">
          이미 계정이 있으신가요?{' '}
          <Link href="/" className="text-white font-semibold hover:text-pink-200 transition-colors underline decoration-2 underline-offset-2">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}