'use client';

import { CohortData } from './types';

interface CohortCardProps {
  cohort: CohortData;
  isSelected: boolean;
  onSelect: (cohortId: number) => void;
}

export default function CohortCard({ 
  cohort, 
  isSelected, 
  onSelect 
}: CohortCardProps) {
  return (
    <div 
      onClick={() => onSelect(cohort.cohort)}
      className={`group relative overflow-hidden bg-white rounded-xl border p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 shadow-lg ring-1 ring-blue-500 ring-opacity-30' 
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* 배경 그래디언트 */}
      <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br ${cohort.color} rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 opacity-3 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${cohort.color} rounded-xl flex items-center justify-center shadow-md transition-transform duration-300`}>
              <span className="text-white font-bold text-base sm:text-lg">{cohort.cohort}</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cohort.name}</h3>
              <p className="text-sm text-slate-600">수강생 {cohort.totalStudents}명</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{cohort.submissionRate}%</div>
            <div className="text-xs text-slate-500">과제 제출률</div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="w-full bg-slate-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden">
          <div 
            className={`h-2 sm:h-3 bg-gradient-to-r ${cohort.color} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${cohort.submissionRate}%` }}
          ></div>
        </div>

        {/* 상세 통계 - 미션 제출 현황 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-300">
            <div className="text-base sm:text-lg font-bold text-slate-900">{cohort.activeStudents}</div>
            <div className="text-xs text-slate-600">제출한 학생</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-300">
            <div className="text-base sm:text-lg font-bold text-slate-900">{cohort.completedMissions}</div>
            <div className="text-xs text-slate-600">발행 미션</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-300">
            <div className="text-base sm:text-lg font-bold text-slate-900">{cohort.totalMissions}</div>
            <div className="text-xs text-slate-600">전체 미션</div>
          </div>
        </div>

        {/* 미션 진행률 표시 */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 mb-1">
            <span>미션 진행률</span>
            <span>{cohort.totalMissions > 0 ? Math.round((cohort.completedMissions / cohort.totalMissions) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${cohort.totalMissions > 0 ? (cohort.completedMissions / cohort.totalMissions) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <div className={`w-2 h-2 bg-gradient-to-r ${cohort.color} rounded-full`}></div>
            <span className="text-slate-600 group-hover:text-slate-800 transition-colors">
              {cohort.submissionRate >= 80 ? '🏆 높은 참여율' : 
               cohort.submissionRate >= 60 ? '📈 양호한 참여율' : '⚠️ 독려 필요'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}