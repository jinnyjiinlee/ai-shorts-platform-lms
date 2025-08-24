// 대시보드 관련 타입 정의
export interface ProgressCardsProps {
  stats: {
    totalMissions: number;
    completedMissions: number;
    completionRate: number;
  };
}