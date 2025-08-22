import {
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Mission } from '../types';
// Helper functions
const getCurrentWeek = (missions: Mission[]) => {
  return Math.max(...missions.map(m => m.week), 1);
};

const getWeeklyProgress = (missions: Mission[]) => {
  return missions.reduce((acc, mission) => {
    acc[mission.week] = mission.submissions.length;
    return acc;
  }, {} as { [week: number]: number });
};

interface MissionStatsCardsProps {
  missions: Mission[];
  selectedCohort: number | 'all';
  activeStudents: number;
}

export default function MissionStatsCards({ missions, selectedCohort, activeStudents }: MissionStatsCardsProps) {
  const currentWeek = getCurrentWeek(missions);
  const weeklyProgress = getWeeklyProgress(missions);
  const maxWeek = Math.max(...missions.map(m => m.week), 0);
  
  // 주차 완료률 계산
  const getWeekCompletionRate = () => {
    const weeks = Object.keys(weeklyProgress);
    if (weeks.length === 0) return 0;
    
    const completedWeeks = weeks.filter(week => {
      const progress = weeklyProgress[parseInt(week)];
      return progress.completed >= progress.total * 0.8; // 80% 이상 완료 시 주차 완료로 간주
    });
    
    return Math.round((completedWeeks.length / weeks.length) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">현재 진행 주차</p>
            <p className="text-3xl font-bold text-blue-900">{currentWeek}주차</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">전체 주차 수</p>
            <p className="text-3xl font-bold text-slate-900">{maxWeek}주차</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">주차 완료율</p>
            <p className="text-3xl font-bold text-slate-900">{getWeekCompletionRate()}%</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">활동 수강생</p>
            <p className="text-3xl font-bold text-slate-900">{activeStudents}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}