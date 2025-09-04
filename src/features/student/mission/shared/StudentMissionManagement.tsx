'use client';

import { useState } from 'react';
import { Mission } from './types';
import MissionHeader from '../notice/MissionHeader';
import ProgressCards from '../../dashboard/components/ProgressCards';
import MissionCard from '../notice/MissionCard';
import MissionList from '../notice/MissionList';
import MissionModal from '../submission/MissionModal';
import { useStudentMissions } from './useMissions';
import { Badge } from '@/features/shared/ui/Badge';
import LoadingState from '../../dashboard/components/LoadingState';

// 공통 카드 스타일 클래스들
const CARD_CLASSES = {
  WHITE_CARD: 'bg-white border border-slate-200',
  LARGE_CARD: 'rounded-2xl p-8 shadow-sm',
  MEDIUM_CARD: 'rounded-xl p-6',
  SMALL_CARD: 'rounded-lg p-4'
};

export default function StudentMissionManagement() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(1);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const { missions, isLoading, studentCohort, missionsByWeek, stats, refreshMissions } = useStudentMissions();

  const handleSubmitMission = (_missionId: string) => {
    setSelectedMission(null);
  };

  const getStatusBadge = (status: string, isSubmitted?: boolean) => {
    if (isSubmitted && status === 'completed') {
      return <Badge variant="success" size="sm">완료</Badge>;
    }
    if (isSubmitted) {
      return <Badge variant="default" size="sm" className="text-blue-600 bg-blue-100">제출 완료</Badge>;
    }
    return <Badge variant="warning" size="sm">제출 대기</Badge>;
  };

  const getStatusColor = (status: string, isSubmitted?: boolean) => {
    if (isSubmitted && status === 'completed') return 'text-green-600 bg-green-100';
    if (isSubmitted) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getStatusText = (status: string, isSubmitted?: boolean) => {
    if (isSubmitted && status === 'completed') return '완료';
    if (isSubmitted) return '제출 완료';
    return '제출 대기';
  };

  if (isLoading) {
    return <LoadingState message="미션을 불러오는 중..." />;
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 - 모티베이션 중심 */}
      <MissionHeader selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} missionsByWeek={missionsByWeek} />

      {/* 진행률 카드 - 모티베이션 중심 재디자인 */}
      <ProgressCards stats={stats} />

      {/* 미션 진행 현황 - 카드 기반 재디자인 */}
      <div className={`${CARD_CLASSES.WHITE_CARD} ${CARD_CLASSES.LARGE_CARD}`}>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-2xl font-bold text-slate-900 flex items-center'>
            <span className='mr-3'>🎯</span>
            미션 로드맵
          </h3>
          <div className='flex items-center space-x-2 text-sm text-slate-600'>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <span>완료</span>
            <div className='w-3 h-3 bg-blue-500 rounded-full ml-4'></div>
            <span>진행중</span>
          </div>
        </div>

        <div className='space-y-6'>
          {missions.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>📋</div>
              <h3 className='text-xl font-semibold text-slate-900 mb-2'>등록된 미션이 없습니다</h3>
              <p className='text-slate-600 mb-4'>{studentCohort}기에 아직 미션이 등록되지 않았습니다.</p>
              <p className='text-sm text-slate-500'>관리자가 미션을 등록하면 여기에 표시됩니다.</p>
            </div>
          ) : (
            missions.map((mission) => <MissionCard key={mission.id} mission={mission} onClick={setSelectedMission} />)
          )}
        </div>
      </div>

      {/* 선택된 주차의 미션 목록 */}
      {selectedWeek && missionsByWeek[selectedWeek] && (
        <div className={`${CARD_CLASSES.WHITE_CARD} ${CARD_CLASSES.MEDIUM_CARD}`}>
          <h2 className='text-xl font-semibold text-slate-900 mb-4'>{selectedWeek}주차 미션</h2>
          <MissionList
            missions={missionsByWeek[selectedWeek]}
            onMissionSelect={setSelectedMission}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getStatusBadge={getStatusBadge}
          />
        </div>
      )}

      {/* 미션 상세/제출 모달 */}
      <MissionModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
        onSubmit={handleSubmitMission}
        refreshMissions={refreshMissions}
      />
    </div>
  );
}
