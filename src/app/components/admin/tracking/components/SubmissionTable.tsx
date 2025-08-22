'use client';

import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

interface WeeklyProgress {
  week: number;
  weekName: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  submitted: number;
  inProgress: number;
  notStarted: number;
  submissionRate: number;
  previousWeekRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface SubmissionTableProps {
  weeklyData: WeeklyProgress[];
}

export default function SubmissionTable({ weeklyData }: SubmissionTableProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
      default:
        return <MinusIcon className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">주차별 제출 현황</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                주차
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                미션명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                제출완료
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                진행중
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                미시작
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                완료율
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                트렌드
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {weeklyData.map((week) => (
              <tr key={week.week} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {week.week}주차
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {week.weekName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {week.startDate} ~ {week.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {week.submitted}/{week.totalStudents}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {week.inProgress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {week.notStarted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(week.submissionRate)}`}>
                    {week.submissionRate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(week.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}