import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Mission } from '../types';
// Helper function to get current week
const getCurrentWeek = (missions: Mission[]) => {
  // Simple implementation: return the highest week number
  return Math.max(...missions.map(m => m.week), 1);
};

interface MissionListProps {
  missions: Mission[];
  onViewSubmissions: (mission: Mission) => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (missionId: number) => void;
}

export default function MissionList({ 
  missions, 
  onViewSubmissions, 
  onEditMission, 
  onDeleteMission 
}: MissionListProps) {
  const currentWeek = missions.length > 0 ? getCurrentWeek(missions) : 1;
  
  // 주차별로 미션 그룹화
  const missionsByWeek = missions.reduce((acc, mission) => {
    if (!acc[mission.week]) acc[mission.week] = [];
    acc[mission.week].push(mission);
    return acc;
  }, {} as { [week: number]: Mission[] });
  
  const weeks = Object.keys(missionsByWeek).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">미션 목록</h2>
        <p className="text-sm text-slate-600 mt-1">주차별로 그룹화되어 표시됩니다</p>
      </div>
      
      <div className="divide-y divide-slate-200">
        {weeks.map(week => (
          <div key={week} className="border-b border-slate-200 last:border-b-0">
            {/* 주차 헤더 */}
            <div className={`p-4 border-l-4 ${
              week === currentWeek 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    week === currentWeek ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {week}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{week}주차</h3>
                  <span className="text-sm text-slate-600">({missionsByWeek[week].length}개 미션)</span>
                  {week === currentWeek && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      진행중
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  총 {missionsByWeek[week].reduce((acc, m) => acc + m.submissions.length, 0)}건 제출
                </div>
              </div>
            </div>
            
            {/* 해당 주차의 미션 목록 */}
            <div className="divide-y divide-slate-100">
              {missionsByWeek[week].map((mission) => (
                <div key={mission.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-base font-medium text-slate-900">{mission.title}</h4>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {mission.cohort}기
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          mission.submissions.length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {mission.submissions.length > 0 ? '제출있음' : '미제출'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3 text-sm line-clamp-2 whitespace-pre-line">{mission.description}</p>
                      <div className="flex items-center space-x-6 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>마감: {mission.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DocumentTextIcon className="w-3 h-3" />
                          <span>{mission.submissions.length}개 제출</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewSubmissions(mission)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="제출 목록 보기"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditMission(mission)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMission(mission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}