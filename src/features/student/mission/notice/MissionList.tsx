'use client';

import { PlayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { MissionListProps } from '../types';
import { Button } from '@/features/shared/ui/Button';

const MISSION_CARD_CLASS = 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-slate-300';

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}월 ${day}일 ${hours}:${minutes}`;
};

const formatSubmittedDate = (dateString: string) => {
  if (!dateString || dateString === 'Invalid Date') return '';
  
  const date = new Date(dateString);
  
  // 유효하지 않은 날짜인 경우 원래 문자열 반환
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // 오전/오후 구분
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${year}년 ${month}월 ${day}일 ${period} ${displayHours}:${minutes}`;
};

export default function MissionList({ 
  missions, 
  onMissionSelect, 
  getStatusColor, 
  getStatusText,
  getStatusBadge
}: MissionListProps) {
  return (
    <div className="space-y-5">
      {missions.map((mission) => (
        <div 
          key={mission.id} 
          className={MISSION_CARD_CLASS}
        >
          <div className="flex items-start justify-between">
            {/* 왼쪽: 미션 정보 */}
            <div className="flex-1 mr-6">
              {/* 미션 제목과 상태 */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-400">{mission.week}w</span>
                  <div className="h-6 w-px bg-slate-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 leading-tight">{mission.title}</h3>
                {getStatusBadge ? getStatusBadge(mission.status, mission.isSubmitted) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status, mission.isSubmitted)}`}>
                    {getStatusText(mission.status, mission.isSubmitted)}
                  </span>
                )}
              </div>

              {/* 날짜 정보 */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-slate-500">
                  <span className="text-red-500">⏰</span>
                  <span className="font-medium">마감일:</span>
                  <span className="text-slate-700">{formatDueDate(mission.due_date)}</span>
                </div>
                {mission.submittedAt && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <span>✅</span>
                    <span className="font-medium">제출일:</span>
                    <span>{formatSubmittedDate(mission.submittedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 액션 버튼 */}
            <div className="flex flex-col space-y-2 flex-shrink-0">
              <Button
                onClick={() => onMissionSelect(mission)}
                variant="primary"
                size="sm"
                leftIcon={<PlayIcon className="w-4 h-4" />}
                className="min-w-[100px] justify-center"
              >
                상세보기
              </Button>
              {!mission.isSubmitted && (
                <Button
                  onClick={() => onMissionSelect(mission)}
                  variant="primary"
                  size="sm"
                  leftIcon={<DocumentArrowUpIcon className="w-4 h-4" />}
                  className="bg-green-600 hover:bg-green-700 focus:ring-green-500 min-w-[100px] justify-center"
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