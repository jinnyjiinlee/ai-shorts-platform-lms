import { CohortData } from './types';

export const mockCohortData: CohortData[] = [
  { 
    cohort: 1, 
    name: '1기', 
    totalStudents: 15, 
    submissionRate: 87,
    activeStudents: 13, 
    totalMissions: 3,
    completedMissions: 2,
    status: 'active',
    color: 'from-green-500 to-green-600',
    statusColor: 'green',
    weeklySubmissions: [
      { week: 1, submissions: 15, totalStudents: 15, rate: 100 },
      { week: 2, submissions: 13, totalStudents: 15, rate: 87 },
      { week: 3, submissions: 14, totalStudents: 15, rate: 93 },
      { week: 4, submissions: 12, totalStudents: 15, rate: 80 },
      { week: 5, submissions: 11, totalStudents: 15, rate: 73 },
      { week: 6, submissions: 13, totalStudents: 15, rate: 87 },
      { week: 7, submissions: 9, totalStudents: 15, rate: 60 },
      { week: 8, submissions: 14, totalStudents: 15, rate: 93 },
      { week: 9, submissions: 10, totalStudents: 15, rate: 67 },
      { week: 10, submissions: 12, totalStudents: 15, rate: 80 },
      { week: 11, submissions: 8, totalStudents: 15, rate: 53 },
      { week: 12, submissions: 11, totalStudents: 15, rate: 73 },
      { week: 13, submissions: 13, totalStudents: 15, rate: 87 },
      { week: 14, submissions: 7, totalStudents: 15, rate: 47 },
      { week: 15, submissions: 9, totalStudents: 15, rate: 60 },
      { week: 16, submissions: 12, totalStudents: 15, rate: 80 }
    ]
  },
  { 
    cohort: 2, 
    name: '2기', 
    totalStudents: 20, 
    submissionRate: 0,
    activeStudents: 0, 
    totalMissions: 0,
    completedMissions: 0,
    status: 'upcoming',
    color: 'from-blue-500 to-blue-600',
    statusColor: 'blue',
    weeklySubmissions: []
  }
];