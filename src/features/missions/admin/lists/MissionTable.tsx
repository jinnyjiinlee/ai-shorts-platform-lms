import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Mission } from '../types';

interface MissionTableProps {
  missions: Mission[];
  isLoading: boolean;
  onViewSubmissions: (mission: Mission) => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (missionId: string) => void;
}

export default function MissionTable({
  missions,
  isLoading,
  onViewSubmissions,
  onEditMission,
  onDeleteMission
}: MissionTableProps) {
  const renderTableHeader = () => (
    <div className="border-b border-slate-200">
      <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-slate-600">
        <div className="col-span-7">제목</div>
        <div className="col-span-2">기수</div>
        <div className="col-span-2">마감일</div>
        <div className="col-span-1">관리</div>
      </div>
    </div>
  );

  const renderMissionRow = (mission: Mission) => (
    <div key={mission.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors">
      <div className="col-span-7">
        <button
          onClick={() => onViewSubmissions(mission)}
          className="text-left w-full hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-1 bg-slate-900 text-white rounded text-xs font-bold">
              {mission.week}W
            </span>
            <h3 className="font-medium text-slate-900">{mission.title}</h3>
          </div>
        </button>
      </div>
      <div className="col-span-2 flex items-center space-x-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {mission.cohort}기
        </span>
      </div>
      <div className="col-span-2 flex items-center text-sm text-slate-600">
        {new Date(mission.due_date).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex items-center space-x-1">
        <button
          onClick={() => onEditMission(mission)}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          title="수정"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDeleteMission(mission.id)}
          className="p-1 text-red-400 hover:text-red-600 transition-colors"
          title="삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {renderTableHeader()}
      
      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">불러오는 중...</p>
          </div>
        ) : missions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">등록된 미션이 없습니다.</p>
            <p className="text-sm">새 미션을 추가해보세요.</p>
          </div>
        ) : (
          missions.map(renderMissionRow)
        )}
      </div>
    </div>
  );
}