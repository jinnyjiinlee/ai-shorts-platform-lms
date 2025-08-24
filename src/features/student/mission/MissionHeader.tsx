'use client';

import { WeekSelectorProps } from './types';

export default function MissionHeader({ 
  selectedWeek, 
  onWeekChange, 
  missionsByWeek 
}: WeekSelectorProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-500"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">나의 미션</h1>
              <p className="text-blue-100 text-lg">꿈을 현실로 만드는 여정이 시작됩니다!</p>
            </div>
          </div>
          
          {/* 주차 선택 드롭다운 - 개선된 디자인 */}
          <div className="flex items-center space-x-3">
            <label className="text-blue-100 font-medium">주차 선택</label>
            <select
              value={selectedWeek || ''}
              onChange={(e) => onWeekChange(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
            >
              <option value="" className="text-slate-800">전체 보기</option>
              {Object.keys(missionsByWeek).map(week => (
                <option key={week} value={week} className="text-slate-800">{week}주차</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}