'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

interface ChartData {
  week: string;
  cohort1: number;
  cohort2: number;
  cohort3?: number;
  average: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

export default function MissionProgressChart() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [selectedMetric, setSelectedMetric] = useState<'submission' | 'completion'>('submission');

  // 샘플 데이터
  const weeklyData: ChartData[] = [
    { week: '1주차', cohort1: 100, cohort2: 90, cohort3: 95, average: 95 },
    { week: '2주차', cohort1: 87, cohort2: 85, cohort3: 92, average: 88 },
    { week: '3주차', cohort1: 53, cohort2: 60, cohort3: 78, average: 64 },
    { week: '4주차', cohort1: 45, cohort2: 55, cohort3: 72, average: 57 },
    { week: '5주차', cohort1: 40, cohort2: 52, cohort3: 68, average: 53 },
    { week: '6주차', cohort1: 38, cohort2: 48, cohort3: 65, average: 50 },
  ];

  const currentWeekStatus: PieData[] = [
    { name: '제출 완료', value: 45, color: '#10b981' },
    { name: '진행 중', value: 25, color: '#f59e0b' },
    { name: '미시작', value: 30, color: '#ef4444' },
  ];

  const cohortComparison = [
    { cohort: '1기', current: 53, previous: 87, best: 100 },
    { cohort: '2기', current: 60, previous: 85, best: 90 },
    { cohort: '3기', current: 78, previous: 92, best: 95 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cohort1" fill="#6366f1" name="1기" />
              <Bar dataKey="cohort2" fill="#8b5cf6" name="2기" />
              <Bar dataKey="cohort3" fill="#ec4899" name="3기" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="cohort1" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="1기" />
              <Area type="monotone" dataKey="cohort2" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="2기" />
              <Area type="monotone" dataKey="cohort3" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} name="3기" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="cohort1" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="1기" />
              <Line type="monotone" dataKey="cohort2" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="2기" />
              <Line type="monotone" dataKey="cohort3" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} name="3기" />
              <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981' }} name="평균" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 차트 타입 선택 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">주차별 달성률 추이</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'line' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              선 그래프
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'bar' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              막대 그래프
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'area' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              영역 그래프
            </button>
          </div>
        </div>
        {renderChart()}
      </div>

      {/* 현재 주차 상태 & 기수 비교 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 현재 주차 상태 파이 차트 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">현재 주차 제출 현황</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={currentWeekStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {currentWeekStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {currentWeekStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 기수별 비교 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">기수별 성과 비교</h3>
          <div className="space-y-4">
            {cohortComparison.map((cohort) => (
              <div key={cohort.cohort} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{cohort.cohort}</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-slate-500">현재: {cohort.current}%</span>
                    <span className="text-slate-500">이전: {cohort.previous}%</span>
                    <span className="text-green-600 font-semibold">최고: {cohort.best}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-xs text-white font-medium z-10">{cohort.current}%</span>
                    </div>
                    <div 
                      className="h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${cohort.current}%` }}
                    />
                    <div 
                      className="absolute top-0 h-6 w-0.5 bg-green-600"
                      style={{ left: `${cohort.best}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}