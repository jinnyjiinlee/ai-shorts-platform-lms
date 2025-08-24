'use client';

interface CompletionStatusProps {
  isCompleted: boolean;
}

export default function CompletionStatus({ isCompleted }: CompletionStatusProps) {
  if (!isCompleted) return null;

  return (
    <div>
      <h4 className='font-medium text-slate-900 mb-3'>제출 완료</h4>
      <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center'>
            <span className='text-xl font-bold text-white'>✓</span>
          </div>
          <div>
            <p className='font-medium text-green-900'>미션을 성공적으로 완료했습니다!</p>
            <p className='text-sm text-green-700'>
              시장 분석이 체계적이고 인사이트가 뛰어납니다. 다음 미션에서도 이 수준을 유지해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
