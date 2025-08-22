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

interface WeeklyProgressViewProps {
  missions: Mission[];
}

export default function WeeklyProgressView({ missions }: WeeklyProgressViewProps) {
  const weeklyProgress = getWeeklyProgress(missions);
  const currentWeek = getCurrentWeek(missions);
  const weeks = Object.keys(weeklyProgress).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">주차별 진행 현황</h2>
        <p className="text-sm text-slate-600 mt-1">각 주차의 모든 미션을 완료해야 주차 완료로 처리됩니다</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {weeks.map(week => {
            const progress = weeklyProgress[week];
            const completionRate = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
            const missionsInWeek = progress.missions.length;
            
            return (
              <div key={week} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      week === currentWeek 
                        ? 'bg-blue-500 text-white' 
                        : completionRate >= 80 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {week}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900">{week}주차</h3>
                      <p className="text-sm text-slate-600">{missionsInWeek}개 미션</p>
                    </div>
                    {week === currentWeek && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        진행중
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-sm text-slate-600">
                      완료: {progress.completed}/{progress.total}명
                    </div>
                    <div className={`text-sm font-medium ${
                      completionRate >= 80 ? 'text-green-600' :
                      completionRate >= 60 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      완료율: {completionRate}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${
                    completionRate >= 80 ? 'text-green-600' :
                    completionRate >= 60 ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>
                    {completionRate}%
                  </div>
                  
                  <div className="w-20">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          completionRate >= 80 ? 'bg-green-500' :
                          completionRate >= 60 ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}