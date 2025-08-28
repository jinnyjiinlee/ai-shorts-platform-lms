'use client';

import { PlayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { MissionListProps } from '../types';

export default function MissionList({ 
  missions, 
  onMissionSelect, 
  getStatusColor, 
  getStatusText 
}: MissionListProps) {
  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <div 
          key={mission.id} 
          className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-slate-900">{mission.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status, mission.isSubmitted)}`}>
                  {getStatusText(mission.status, mission.isSubmitted)}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>📅 마감일: {mission.due_date}</span>
                {mission.submittedAt && (
                  <span>✅ 제출일: {mission.submittedAt}</span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onMissionSelect(mission)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
              >
                <PlayIcon className="w-4 h-4" />
                <span>상세보기</span>
              </button>
              {!mission.isSubmitted && (
                <button
                  onClick={() => onMissionSelect(mission)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                >
                  <DocumentArrowUpIcon className="w-4 h-4" />
                  <span>제출하기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}