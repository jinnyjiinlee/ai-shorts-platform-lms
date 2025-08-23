'use client';

import {
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

interface WeeklyProgressHeaderProps {
  selectedCohort: number | 'all';
  selectedWeek: number | 'all';
  showChart: boolean;
  availableCohorts: number[];
  availableWeeks: number[];
  onCohortChange: (cohort: number | 'all') => void;
  onWeekChange: (week: number | 'all') => void;
  onToggleChart: () => void;
  onExportExcel: () => void;
  onSendNotifications: () => void;
}

export default function WeeklyProgressHeader({
  selectedCohort,
  selectedWeek,
  showChart,
  availableCohorts,
  availableWeeks,
  onCohortChange,
  onWeekChange,
  onToggleChart,
  onExportExcel,
  onSendNotifications
}: WeeklyProgressHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <CalendarDaysIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">주차별 미션 달성률</h2>
            <p className="text-indigo-100 text-lg">각 주차별로 학생들의 미션 제출 현황을 한눈에 확인하세요</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedCohort}
            onChange={(e) => onCohortChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="all" className="text-slate-800">전체 기수</option>
            {availableCohorts.map(cohort => (
              <option key={cohort} value={cohort} className="text-slate-800">{cohort}기</option>
            ))}
          </select>

          <select
            value={selectedWeek}
            onChange={(e) => onWeekChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="all" className="text-slate-800">전체 주차</option>
            {availableWeeks.map(week => (
              <option key={week} value={week} className="text-slate-800">{week}주차</option>
            ))}
          </select>

          <button
            onClick={onToggleChart}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>{showChart ? '차트 숨기기' : '차트 보기'}</span>
          </button>

          <button
            onClick={onExportExcel}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>엑셀 다운로드</span>
          </button>

          <button
            onClick={onSendNotifications}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <BellAlertIcon className="w-5 h-5" />
            <span>미제출 알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}