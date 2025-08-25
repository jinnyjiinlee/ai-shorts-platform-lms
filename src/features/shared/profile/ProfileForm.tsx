'use client';

interface FormData {
  user_id: string;
  email: string;
  phone: string;
  name: string;
  nickname: string;
  cohort: number;
  role: string;
  status: string;
}

interface ProfileFormProps {
  userRole: 'admin' | 'student';
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export default function ProfileForm({ userRole, formData, onInputChange }: ProfileFormProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { text: '승인됨', color: 'bg-green-100 text-green-800 border-green-200' },
      pending: { text: '대기중', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      rejected: { text: '거부됨', color: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      text: '알 수 없음',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>{config.text}</span>;
  };

  return (
    <div className='lg:col-span-2'>
      <div className='bg-white rounded-2xl shadow-lg border border-slate-200 p-6'>
        <h2 className='text-xl font-bold text-slate-900 mb-6'>기본 정보</h2>

        <div className='space-y-6'>
          {userRole === 'student' && (
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>아이디</label>
              <input
                type='text'
                value={formData.user_id}
                disabled
                className='w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>실명</label>
            <input
              type='text'
              value={formData.name}
              disabled
              className='w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed'
              placeholder='이름을 입력하세요'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>활동명</label>
            <input
              value={formData.nickname || ''}
              onChange={(e) => onInputChange('nickname', e.target.value)}
              className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>휴대폰</label>
            <input
              value={formData.phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>카카오 아이디</label>
            <input
              value={formData.email || ''}
              disabled
              className='w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed'
            />
          </div>

          {userRole === 'student' && (
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>닉네임</label>
              <input
                type='text'
                value={formData.nickname}
                onChange={(e) => onInputChange('nickname', e.target.value)}
                className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                placeholder='닉네임을 입력하세요'
              />
            </div>
          )}

          {userRole === 'student' && (
            <>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>기수</label>
                <input
                  type='text'
                  value={formData.cohort ? `${formData.cohort}기` : ''}
                  disabled
                  className='w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>계정 상태</label>
                <div className='pt-2'>{getStatusBadge(formData.status)}</div>
              </div>
            </>
          )}

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>역할</label>
            <input
              type='text'
              value={formData.role}
              disabled
              className='w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
