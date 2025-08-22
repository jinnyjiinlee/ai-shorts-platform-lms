'use client';

interface ProgressStatsCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number;
  suffix?: string;
  colorClass?: string;
}

export default function ProgressStatsCard({ 
  title, 
  value, 
  trend, 
  previousValue, 
  suffix = '', 
  colorClass = 'text-blue-600' 
}: ProgressStatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className={`text-2xl font-bold mt-1 ${colorClass}`}>
            {value}{suffix}
          </div>
        </div>
        {trend && previousValue !== undefined && (
          <div className={`text-sm ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            {Math.abs(value - previousValue)}{suffix}
          </div>
        )}
      </div>
    </div>
  );
}