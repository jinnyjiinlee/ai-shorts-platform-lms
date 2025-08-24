'use client';

import { useRouter } from 'next/navigation';
import { CheckIcon, ClockIcon, CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WeekProgressProps {
  weeklyProgress: { 
    week: number; 
    title: string; 
    completed: boolean; 
    dueDate?: string; 
  }[];
}

export default function WeeklyProgress({ weeklyProgress }: WeekProgressProps) {
  const router = useRouter();
  
  const completedCount = weeklyProgress.filter(week => week.completed).length;
  const totalCount = weeklyProgress.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const handleClick = () => {
    router.push('/student/mission');
  };

  return (
    <div 
      onClick={handleClick}
      className="h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-6 py-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">주차별 미션</h3>
            <p className="text-sm text-slate-600 mt-1">
              {completedCount}/{totalCount} 완료 ({completionRate}%)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-700">완료</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-blue-700">진행중</span>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="px-6 py-4 bg-slate-50/50">
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${completionRate}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 요약 정보 및 CTA */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        {weeklyProgress.length > 0 ? (
          <>
            <div className="mb-4">
              <div className="text-5xl mb-3">📚</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {totalCount - completedCount}개의 미션이 남았어요!
              </h4>
              <p className="text-sm text-slate-600">
                클릭하여 전체 미션을 확인하고 제출해보세요
              </p>
            </div>
            
            {/* 최근 미션 미리보기 (선택사항) */}
            <div className="w-full max-w-sm bg-slate-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-500 mb-2">최근 미션</p>
              <div className="space-y-1">
                {weeklyProgress.slice(0, 2).map((week, index) => (
                  <div key={`preview-${week.week}-${index}`} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{week.week}주차: {week.title}</span>
                    {week.completed ? (
                      <CheckIcon className="w-3 h-3 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all group-hover:scale-105 shadow-lg">
              나의 미션 보기
              <ChevronRightIcon className="inline w-4 h-4 ml-1" />
            </button>
          </>
        ) : (
          <div>
            <ClockIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-4">아직 등록된 미션이 없습니다.</p>
            <button className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-medium">
              미션 페이지로 이동
              <ChevronRightIcon className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}