export default function ProfileHeader({ userRole, title = '프로필 관리' }: { userRole: 'admin' | 'student'; title?: string }) {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
      </div>
      <div className="relative flex items-center space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">👤</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-indigo-100 text-lg">
            {title === '프로필 생성' 
              ? userRole === 'admin' ? '관리자 정보 생성' : '내 정보 생성'
              : userRole === 'admin' ? '관리자 정보 수정' : '내 정보 관리'
            }
          </p>
        </div>
      </div>
    </div>
  );
}