interface TrackingStatsProps {
  overallRate: number;
  totalSubmissions: number;
  totalMissions: number;
}

export default function StatsCards({ 
  overallRate, 
  totalSubmissions, 
  totalMissions 
}: TrackingStatsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{overallRate}%</div>
          <div className="text-xs text-slate-600">전체 제출률</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{totalSubmissions}</div>
          <div className="text-xs text-slate-600">총 제출 건수</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-slate-600">{totalMissions}</div>
          <div className="text-xs text-slate-600">등록된 미션 수</div>
        </div>
      </div>
    </div>
  );
}