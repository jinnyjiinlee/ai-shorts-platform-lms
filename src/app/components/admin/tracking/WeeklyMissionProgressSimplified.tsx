'use client';

import { useState } from 'react';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import MissionProgressChart from './MissionProgressChart';
import WeeklyProgressHeader from './components/WeeklyProgressHeader';
import WeeklyProgressStats from './components/WeeklyProgressStats';
import WeeklyProgressDetails from './components/WeeklyProgressDetails';
import { CohortWeeklyData } from './types';

export default function WeeklyMissionProgressSimplified() {
  const [selectedCohort, setSelectedCohort] = useState<number | 'all'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [showChart, setShowChart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 샘플 데이터 - 실제로는 API에서 가져와야 함
  const cohortData: CohortWeeklyData[] = [
    {
      cohort: 1,
      overallRate: 78,
      weeks: [
        {
          week: 1,
          weekName: '첫 번째 쇼츠 제작',
          startDate: '2024-08-19',
          endDate: '2024-08-25',
          totalStudents: 15,
          submitted: 15,
          inProgress: 0,
          notStarted: 0,
          submissionRate: 100,
          previousWeekRate: 0,
          trend: 'up'
        },
        {
          week: 2,
          weekName: '콘텐츠 기획서 작성',
          startDate: '2024-08-26',
          endDate: '2024-09-01',
          totalStudents: 15,
          submitted: 13,
          inProgress: 1,
          notStarted: 1,
          submissionRate: 87,
          previousWeekRate: 100,
          trend: 'down'
        }
      ]
    }
  ];

  const availableCohorts = cohortData.map(c => c.cohort);
  const availableWeeks = Array.from(new Set(cohortData.flatMap(c => c.weeks.map(w => w.week)))).sort();

  const getFilteredData = () => {
    if (selectedCohort === 'all') {
      return cohortData;
    }
    return cohortData.filter(c => c.cohort === selectedCohort);
  };

  const calculateOverallStats = () => {
    const filteredData = getFilteredData();
    let totalSubmitted = 0;
    let totalStudents = 0;
    let totalInProgress = 0;

    filteredData.forEach(cohort => {
      const weeks = selectedWeek === 'all' 
        ? cohort.weeks 
        : cohort.weeks.filter(w => w.week === selectedWeek);
      
      weeks.forEach(week => {
        totalSubmitted += week.submitted;
        totalStudents += week.totalStudents;
        totalInProgress += week.inProgress;
      });
    });

    const overallRate = totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0;

    return {
      totalSubmitted,
      totalStudents,
      totalInProgress,
      overallRate,
      notStarted: totalStudents - totalSubmitted - totalInProgress
    };
  };

  const handleExportExcel = () => {
    const data = getFilteredData().flatMap(cohort => 
      cohort.weeks.map(week => ({
        '기수': `${cohort.cohort}기`,
        '주차': `${week.week}주차`,
        '주차명': week.weekName,
        '시작일': week.startDate,
        '종료일': week.endDate,
        '전체학생': week.totalStudents,
        '제출완료': week.submitted,
        '진행중': week.inProgress,
        '미시작': week.notStarted,
        '제출률': `${week.submissionRate}%`
      }))
    );
    
    console.log('Excel export data:', data);
    alert('엑셀 다운로드 기능이 실행됩니다. (실제 구현 필요)');
  };

  const handleSendNotifications = () => {
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 3000);
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="space-y-6">
      <WeeklyProgressHeader
        selectedCohort={selectedCohort}
        selectedWeek={selectedWeek}
        showChart={showChart}
        availableCohorts={availableCohorts}
        availableWeeks={availableWeeks}
        onCohortChange={setSelectedCohort}
        onWeekChange={setSelectedWeek}
        onToggleChart={() => setShowChart(!showChart)}
        onExportExcel={handleExportExcel}
        onSendNotifications={handleSendNotifications}
      />

      <WeeklyProgressStats stats={overallStats} />

      {showNotifications && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <BellAlertIcon className="w-5 h-5" />
            <span>미제출 학생들에게 알림을 전송했습니다.</span>
          </div>
        </div>
      )}

      {showChart && <MissionProgressChart />}

      <WeeklyProgressDetails 
        cohorts={getFilteredData()} 
        selectedWeek={selectedWeek}
      />
    </div>
  );
}