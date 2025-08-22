import { useEffect, useState } from 'react';

export interface Student {
  id: number;
  name: string;
  email: string;
  cohort: number;
  submittedMissions: number;
  totalMissions: number;
  submissionRate: number;
  lastSubmission: string;
  status: 'excellent' | 'good' | 'needs_attention' | 'inactive';
}

export interface Mission {
  id: number;
  title: string;
  week: number;
  cohort: number;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  submissionRate: number;
  status: 'active' | 'completed' | 'overdue';
}

export interface WeeklyProgress {
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

export interface CohortWeeklyData {
  cohort: number;
  weeks: WeeklyProgress[];
  overallRate: number;
}

export function useMissionData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [weeklyData, setWeeklyData] = useState<CohortWeeklyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 실시간 데이터 업데이트 시뮬레이션
  const updateData = () => {
    setIsLoading(true);
    
    // 학생 데이터 업데이트
    const updatedStudents: Student[] = [
      {
        id: 1,
        name: '김철수',
        email: 'kim@example.com',
        cohort: 1,
        submittedMissions: Math.floor(Math.random() * 2) + 2,
        totalMissions: 3,
        submissionRate: Math.floor(Math.random() * 30) + 70,
        lastSubmission: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
        status: 'excellent'
      },
      {
        id: 2,
        name: '이영희',
        email: 'lee@example.com',
        cohort: 1,
        submittedMissions: Math.floor(Math.random() * 2) + 1,
        totalMissions: 3,
        submissionRate: Math.floor(Math.random() * 30) + 50,
        lastSubmission: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
        status: 'good'
      },
      {
        id: 3,
        name: '박민수',
        email: 'park@example.com',
        cohort: 1,
        submittedMissions: Math.floor(Math.random() * 2),
        totalMissions: 3,
        submissionRate: Math.floor(Math.random() * 30) + 20,
        lastSubmission: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
        status: 'needs_attention'
      },
      {
        id: 4,
        name: '정수진',
        email: 'jung@example.com',
        cohort: 2,
        submittedMissions: 0,
        totalMissions: 1,
        submissionRate: 0,
        lastSubmission: '-',
        status: 'inactive'
      }
    ];

    // 미션 데이터 업데이트
    const updatedMissions: Mission[] = [
      {
        id: 1,
        title: '1주차 - 첫 번째 유튜브 쇼츠 제작',
        week: 1,
        cohort: 1,
        dueDate: '2024-08-25',
        totalStudents: 15,
        submittedCount: 15,
        submissionRate: 100,
        status: 'completed'
      },
      {
        id: 2,
        title: '2주차 - 콘텐츠 기획서 작성',
        week: 2,
        cohort: 1,
        dueDate: '2024-08-30',
        totalStudents: 15,
        submittedCount: Math.floor(Math.random() * 3) + 12,
        submissionRate: Math.floor(Math.random() * 20) + 80,
        status: 'active'
      },
      {
        id: 3,
        title: '3주차 - 트렌드 분석 리포트',
        week: 3,
        cohort: 1,
        dueDate: '2024-09-05',
        totalStudents: 15,
        submittedCount: Math.floor(Math.random() * 5) + 5,
        submissionRate: Math.floor(Math.random() * 30) + 40,
        status: 'active'
      }
    ];

    // 주차별 데이터 업데이트
    const updatedWeeklyData: CohortWeeklyData[] = [
      {
        cohort: 1,
        overallRate: Math.floor(Math.random() * 20) + 70,
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
            submitted: Math.floor(Math.random() * 3) + 12,
            inProgress: Math.floor(Math.random() * 2),
            notStarted: Math.floor(Math.random() * 2),
            submissionRate: Math.floor(Math.random() * 20) + 80,
            previousWeekRate: 100,
            trend: 'down'
          },
          {
            week: 3,
            weekName: '트렌드 분석 리포트',
            startDate: '2024-09-02',
            endDate: '2024-09-08',
            totalStudents: 15,
            submitted: Math.floor(Math.random() * 5) + 5,
            inProgress: Math.floor(Math.random() * 4) + 2,
            notStarted: Math.floor(Math.random() * 4) + 1,
            submissionRate: Math.floor(Math.random() * 30) + 40,
            previousWeekRate: 87,
            trend: 'down'
          }
        ]
      },
      {
        cohort: 2,
        overallRate: Math.floor(Math.random() * 30) + 40,
        weeks: [
          {
            week: 1,
            weekName: '첫 번째 쇼츠 제작',
            startDate: '2024-08-26',
            endDate: '2024-09-01',
            totalStudents: 20,
            submitted: Math.floor(Math.random() * 3) + 15,
            inProgress: Math.floor(Math.random() * 3),
            notStarted: Math.floor(Math.random() * 2),
            submissionRate: Math.floor(Math.random() * 20) + 80,
            previousWeekRate: 0,
            trend: 'up'
          }
        ]
      }
    ];

    setStudents(updatedStudents);
    setMissions(updatedMissions);
    setWeeklyData(updatedWeeklyData);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // 초기 데이터 로드
  useEffect(() => {
    updateData();
  }, []);

  // 30초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    students,
    missions,
    weeklyData,
    isLoading,
    lastUpdated,
    refreshData: updateData
  };
}