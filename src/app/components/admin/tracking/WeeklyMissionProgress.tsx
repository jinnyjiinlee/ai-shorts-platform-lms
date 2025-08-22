'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

import { 
  fetchAdminTrackingData, 
  AdminDashboardStats, 
  CohortWeeklyData 
} from '../../../../lib/services/tracking/adminTrackingService';
import ProgressStatsCard from './components/ProgressStatsCard';
import CohortSelector from './components/CohortSelector';
import SubmissionTable from './components/SubmissionTable';
import MissionProgressChart from './MissionProgressChart';

export default function WeeklyMissionProgress() {
  const [selectedCohort, setSelectedCohort] = useState<number | 'all'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [showChart, setShowChart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdminTrackingData();
        setDashboardData(data);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getFilteredData = (): CohortWeeklyData[] => {
    if (!dashboardData) return [];
    
    if (selectedCohort === 'all') {
      return dashboardData.cohortData;
    }
    
    return dashboardData.cohortData.filter(c => c.cohort === selectedCohort);
  };

  const getAvailableCohorts = (): number[] => {
    if (!dashboardData) return [];
    return dashboardData.cohortData.map(c => c.cohort).sort((a, b) => a - b);
  };

  const getAllWeeksData = () => {
    const filteredData = getFilteredData();
    return filteredData.flatMap(cohort => cohort.weeks);
  };

  const getOverallStats = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return { totalStudents: 0, averageRate: 0 };

    const totalStudents = filteredData.reduce((sum, cohort) => 
      sum + (cohort.weeks[0]?.totalStudents || 0), 0);
    const averageRate = Math.round(
      filteredData.reduce((sum, cohort) => sum + cohort.overallRate, 0) / filteredData.length
    );

    return { totalStudents, averageRate };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="text-red-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-medium">오류 발생</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getOverallStats();
  const weeklyData = getAllWeeksData();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">미션 진행 현황</h1>
          <p className="text-slate-600 mt-1">수강생들의 주차별 미션 제출 현황을 확인하세요</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <CohortSelector
            selectedCohort={selectedCohort}
            onCohortChange={setSelectedCohort}
            availableCohorts={getAvailableCohorts()}
          />
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChart(!showChart)}
              className={`px-4 py-2 rounded-lg border transition-colors ${{
                true: 'bg-blue-600 text-white border-blue-600',
                false: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }[showChart.toString()]}`}
            >
              <ChartBarIcon className="w-4 h-4 mr-2 inline" />
              차트 보기
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`px-4 py-2 rounded-lg border transition-colors ${{
                true: 'bg-orange-600 text-white border-orange-600',
                false: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }[showNotifications.toString()]}`}
            >
              <BellAlertIcon className="w-4 h-4 mr-2 inline" />
              알림
            </button>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
              내보내기
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressStatsCard
          title="총 수강생"
          value={stats.totalStudents}
          suffix="명"
          colorClass="text-blue-600"
        />
        <ProgressStatsCard
          title="평균 완료율"
          value={stats.averageRate}
          suffix="%"
          colorClass="text-green-600"
        />
        <ProgressStatsCard
          title="총 미션 수"
          value={dashboardData?.totalMissions || 0}
          suffix="개"
          colorClass="text-purple-600"
        />
      </div>

      {/* 차트 (선택적) */}
      {showChart && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">완료율 추이</h3>
          <MissionProgressChart data={weeklyData} />
        </div>
      )}

      {/* 제출 현황 테이블 */}
      <SubmissionTable weeklyData={weeklyData} />

      {/* 알림 패널 (선택적) */}
      {showNotifications && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">주의가 필요한 항목</h3>
          <div className="space-y-3">
            {weeklyData
              .filter(week => week.submissionRate < 60)
              .map(week => (
                <div key={`${week.week}`} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <BellAlertIcon className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {week.week}주차 - {week.weekName}
                    </p>
                    <p className="text-sm text-slate-600">
                      완료율 {week.submissionRate}% (목표: 80% 이상)
                    </p>
                  </div>
                </div>
              ))}
            {weeklyData.filter(week => week.submissionRate < 60).length === 0 && (
              <p className="text-orange-700">현재 주의가 필요한 항목이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}