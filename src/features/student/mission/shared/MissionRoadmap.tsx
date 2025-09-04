'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Mission } from './types';
import Badge from '@/features/shared/ui/Badge/Badge';

interface MissionRoadmapProps {
  missions: Mission[];
  onMissionClick: (mission: Mission) => void;
  selectedWeek?: number | null;
  onWeekChange?: (week: number | null) => void;
}

export default function MissionRoadmap({ missions, onMissionClick, selectedWeek, onWeekChange }: MissionRoadmapProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showAllMissions, setShowAllMissions] = useState<boolean>(false);

  // 미션을 주차별로 정렬
  const sortedMissions = [...missions].sort((a, b) => a.week - b.week);

  const getStepStatus = (mission: Mission) => {
    if (mission.isSubmitted) {
      return 'submitted';
    } else {
      return 'pending';
    }
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-200';
      default:
        return 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-600 border-2 border-slate-200 shadow-md';
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus?: string) => {
    if (currentStatus === 'submitted') {
      return 'bg-blue-300';
    } else {
      return 'bg-slate-300';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  // 표시할 미션 결정 (선택된 미션이 있으면 선택된 미션, 없으면 현재 진행 중인 미션)
  const currentMission = selectedMission || sortedMissions.find((m) => !m.isSubmitted) || sortedMissions[0];

  // 표시할 미션 수 결정
  const displayedMissions = showAllMissions ? sortedMissions : sortedMissions.slice(0, 7);

  const handleMissionSelect = (mission: Mission) => {
    // 미션을 선택하면 해당 주차로 전환
    if (onWeekChange) {
      onWeekChange(mission.week);
    }
    setSelectedMission(selectedMission?.id === mission.id ? null : mission);
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 shadow-sm border border-slate-200'>
      {/* 헤더 */}
      <div className='flex items-center justify-between mb-8'>
        <h3 className='text-2xl font-bold text-slate-900 flex items-center'>
          <span className='mr-3'>🎯</span>
          미션 로드맵
        </h3>
        <div className='flex items-center space-x-4'>
          {/* 범례 */}
          <div className='flex items-center space-x-2 text-sm text-slate-600'>
            <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
            <span>제출완료</span>
            <div className='w-3 h-3 bg-slate-400 rounded-full ml-4'></div>
            <span>미제출</span>
          </div>
        </div>
      </div>

      {/* 로드맵 단계 - 통합 컴포넌트 방식 */}
      <div className='relative mb-8'>
        {/* 연결선 배경 레이어 */}
        <div className='absolute top-10 left-16 right-16 h-1 flex'>
          {sortedMissions.slice(0, 7).map((mission, index) => {
            if (index === sortedMissions.length - 1 || index === 6) return null;
            const status = getStepStatus(mission);
            return (
              <div key={`connector-${mission.id}`} className={`flex-1 h-1 ${getConnectorColor(status)} rounded-full`} />
            );
          })}
        </div>

        {/* 미션 스텝들 */}
        <div className='flex justify-between px-8'>
          {sortedMissions.slice(0, 7).map((mission, index) => {
            const status = getStepStatus(mission);

            return (
              <div key={mission.id} className='flex flex-col items-center relative z-10' style={{ flex: '1 1 0%' }}>
                {/* 원형 버튼 */}
                <button
                  onClick={() => handleMissionSelect(mission)}
                  className={`relative w-16 h-16 rounded-full ${getStepStyles(
                    status
                  )} shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group mb-4 ${
                    selectedMission?.id === mission.id ? 'ring-3 ring-blue-300 scale-105' : ''
                  }`}
                >
                  {status === 'submitted' ? (
                    <>
                      <svg className='w-4 h-4 mb-0.5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z' />
                      </svg>
                      <span className='text-xs font-bold'>{mission.week}w</span>
                    </>
                  ) : (
                    <span className='text-sm font-bold'>{mission.week}w</span>
                  )}
                </button>

                {/* 미션 정보 */}
                <div className='text-center max-w-24'>
                  <p className='text-xs text-gray-500 mb-1'>{formatDueDate(mission.due_date)}</p>
                  <h4 className='text-xs font-medium text-gray-700 leading-tight break-words'>{mission.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 선택된/현재 미션 정보 */}
      {currentMission && (
        <div
          className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${
            selectedMission
              ? 'border-blue-200'
              : getStepStatus(currentMission) === 'submitted'
              ? 'border-blue-200'
              : 'border-slate-200'
          }`}
        >
          {/* 상단 영역 */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <Badge variant={getStepStatus(currentMission) === 'submitted' ? 'info' : 'default'} size='sm'>
                {getStepStatus(currentMission) === 'submitted' ? '제출완료' : '미제출'}
              </Badge>
              <span className='text-sm text-slate-500'>{currentMission.week}w 미션</span>
            </div>

            <span className='text-xs text-slate-500'>마감: {formatDueDate(currentMission.due_date)}</span>
          </div>

          {/* 미션 내용 */}
          <div className='mb-4'>
            <h4 className='text-lg font-semibold text-slate-900 mb-2'>{currentMission.title}</h4>
            <p className='text-sm text-slate-600 leading-relaxed'>
              {currentMission.description ||
                "핸드폰으로 구글계정을 생성해주세요. 생성을 완료했다면 '구글계정 생성완료' 라고 작성해주세요"}
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className='flex gap-3'>
            <button
              onClick={() => onMissionClick(currentMission)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-white hover:shadow-md transition-all duration-200 ${
                getStepStatus(currentMission) === 'submitted'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-slate-600 hover:bg-slate-700'
              }`}
            >
              {getStepStatus(currentMission) === 'submitted' ? '제출 내용 보기' : '제출하기'}
            </button>

            {selectedMission && (
              <button
                onClick={() => setSelectedMission(null)}
                className='px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200'
              >
                선택 해제
              </button>
            )}
          </div>
        </div>
      )}

      {/* 미션이 선택되지 않았을 때 안내 메시지 */}
      {!selectedMission && !sortedMissions.find((m) => !m.isSubmitted) && sortedMissions.length > 0 && (
        <div className='text-center py-8 text-slate-500'>
          <div className='mb-2'>👆</div>
          <p className='text-sm'>위의 동그라미를 클릭해서 미션 정보를 확인해보세요</p>
        </div>
      )}
    </div>
  );
}
