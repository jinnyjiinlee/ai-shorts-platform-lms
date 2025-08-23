'use client';

import { CheckIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface WeekProgressProps {
  weeklyProgress: { 
    week: number; 
    title: string; 
    completed: boolean; 
    dueDate?: string; 
  }[];
}

export default function WeeklyProgress({ weeklyProgress }: WeekProgressProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // 한국 시간대로 포맷팅
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Seoul',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return date.toLocaleString('ko-KR', options).replace(/\s/, ' ');
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const completedCount = weeklyProgress.filter(week => week.completed).length;
  const totalCount = weeklyProgress.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg overflow-hidden flex flex-col">
      {/* 헤더 - 컴팩트하게 */}
      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-4 py-3 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">주차별 미션</h3>
            <p className="text-xs text-slate-600">
              {completedCount}/{totalCount} 완료 ({completionRate}%)
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-700">완료</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-blue-700">진행중</span>
            </div>
          </div>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="px-4 py-3 bg-slate-50/50">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* 미션 리스트 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto p-4">
        {weeklyProgress.length > 0 ? (
          <div className="space-y-3">
            {weeklyProgress.map((week, index) => {
              const overdue = isOverdue(week.dueDate) && !week.completed;
              
              return (
                <div 
                  key={`week-${week.week}-${index}`} 
                  className={`relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                    week.completed 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : overdue
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                      : 'bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        week.completed 
                          ? 'bg-green-500 text-white' 
                          : overdue
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {week.completed ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{week.week}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            week.completed 
                              ? 'bg-green-100 text-green-700' 
                              : overdue
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {week.week}주차
                          </span>
                        </div>
                        <h4 className={`font-medium text-sm ${
                          week.completed ? 'text-green-800' : 'text-slate-800'
                        }`}>
                          {week.title}
                        </h4>
                        {week.dueDate && (
                          <div className={`flex items-center space-x-1 text-xs mt-1 ${
                            overdue ? 'text-red-600' : 'text-slate-500'
                          }`}>
                            <CalendarIcon className="w-3 h-3" />
                            <span>마감: {formatDate(week.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {week.completed && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        완료
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">아직 등록된 미션이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}