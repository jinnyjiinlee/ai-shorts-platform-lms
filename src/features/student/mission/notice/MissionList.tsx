'use client';

import { PlayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { MissionListProps } from '../types';
import { Button } from '@/features/shared/ui/Button';

const MISSION_CARD_CLASS = 'bg-white border border-slate-200 rounded-lg p-4';

export default function MissionList({ 
  missions, 
  onMissionSelect, 
  getStatusColor, 
  getStatusText,
  getStatusBadge
}: MissionListProps) {
  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <div 
          key={mission.id} 
          className={`${MISSION_CARD_CLASS} hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-slate-900">{mission.title}</h3>
                {getStatusBadge ? getStatusBadge(mission.status, mission.isSubmitted) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status, mission.isSubmitted)}`}>
                    {getStatusText(mission.status, mission.isSubmitted)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>📅 마감일: {mission.due_date}</span>
                {mission.submittedAt && (
                  <span>✅ 제출일: {mission.submittedAt}</span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => onMissionSelect(mission)}
                variant="primary"
                size="sm"
                leftIcon={<PlayIcon className="w-4 h-4" />}
              >
                상세보기
              </Button>
              {!mission.isSubmitted && (
                <Button
                  onClick={() => onMissionSelect(mission)}
                  variant="primary"
                  size="sm"
                  leftIcon={<DocumentArrowUpIcon className="w-4 h-4" />}
                  className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  제출하기
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}