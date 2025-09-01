'use client';

import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import { WeekBadge, DifficultyBadge, PointsBadge } from '@/features/shared/ui/Badge';
import { Mission } from '@/types/domains/mission';

interface MissionBoardProps {
  missions: Mission[];
  userRole: 'admin' | 'student';
  loading?: boolean;
  error?: string;
  onCreateMission?: () => void;
  onViewMission?: (mission: Mission) => void;
  onEditMission?: (mission: Mission) => void;
  onDeleteMission?: (id: string) => void;
}

export default function MissionBoard({
  missions,
  userRole,
  loading,
  error,
  onCreateMission,
  onViewMission,
  onEditMission,
  onDeleteMission,
}: MissionBoardProps) {
  
  // Mission을 BoardItem으로 변환
  const boardItems: BoardItem[] = missions.map(mission => ({
    id: mission.id,
    title: mission.title,
    content: mission.description || mission.content,
    author: '관리자',
    createdAt: new Date(mission.created_at).toLocaleDateString('ko-KR'),
    isPinned: false, // 미션에는 고정 기능이 없으므로 false
    isPublished: mission.status === 'published',
    badges: [
      // 난이도 배지
      <DifficultyBadge 
        key="difficulty" 
        difficulty={mission.difficulty}
        size="md"
        variant="gradient"
        format="korean"
      />,
      
      // 포인트 배지
      <PointsBadge 
        key="points" 
        points={mission.points}
        size="md"
        variant="gradient"
        theme="violet-purple"
        format="점"
      />,
      
      // 주차 배지
      <WeekBadge 
        key="week" 
        week={mission.week}
        size="md"
        variant="gradient"
        theme="indigo-purple"
        format="W"
      />,
    ].filter(Boolean)
  }));

  const extraActions = (item: BoardItem) => {
    const mission = missions.find(m => m.id === item.id);
    if (!mission || userRole !== 'admin') return [];

    return [
      // 상태 토글 버튼
      <button
        key="status"
        onClick={() => {
          // 상태 토글 로직 (published ↔ draft)
          console.log('Toggle status for mission:', mission.id);
        }}
        className={`p-2 rounded-lg transition-colors ${
          mission.status === 'published'
            ? 'text-green-600 hover:bg-green-50'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
        title={mission.status === 'published' ? '비공개로 변경' : '공개하기'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={mission.status === 'published'
              ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            }
          />
        </svg>
      </button>
    ];
  };

  return (
    <UniversalBoard
      title="미션 공지"
      description="학습 미션과 과제를 확인하고 관리하세요"
      icon={<RocketLaunchIcon className="w-6 h-6 text-blue-600" />}
      items={boardItems}
      userRole={userRole}
      loading={loading}
      error={error}
      onCreateItem={onCreateMission}
      onViewItem={(item) => {
        const mission = missions.find(m => m.id === item.id);
        if (mission && onViewMission) onViewMission(mission);
      }}
      onEditItem={(item) => {
        const mission = missions.find(m => m.id === item.id);
        if (mission && onEditMission) onEditMission(mission);
      }}
      onDeleteItem={onDeleteMission}
      extraActions={extraActions}
    />
  );
}