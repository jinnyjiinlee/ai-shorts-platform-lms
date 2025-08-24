interface TrackingStatsProps {
  overallRate: number;
  totalSubmissions: number;
  totalMissions: number;
}

export default function TrackingStats({ 
  overallRate, 
  totalSubmissions, 
  totalMissions 
}: TrackingStatsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{overallRate}%</div>
          <div className="text-sm text-slate-600">전체 제출률</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{totalSubmissions}</div>
          <div className="text-sm text-slate-600">총 제출 건수</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-600">{totalMissions}</div>
          <div className="text-sm text-slate-600">등록된 미션 수</div>
        </div>
      </div>
    </div>
  );
}