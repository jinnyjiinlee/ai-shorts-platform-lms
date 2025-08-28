'use client';

import { WeekSelectorProps } from '../types';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';

export default function MissionHeader({ 
  selectedWeek, 
  onWeekChange, 
  missionsByWeek 
}: WeekSelectorProps) {
  return (
    <div className="mb-8">
      <AdminPageHeader
        variant="gradient"
        icon="🎯"
        title="나의 미션"
        description="꿈을 현실로 만드는 여정이 시작됩니다!"
        selectedWeek={selectedWeek}
        availableWeeks={missionsByWeek}
        onWeekChange={onWeekChange}
      />
    </div>
  );
}