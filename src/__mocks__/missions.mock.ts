import { Mission } from './types';

// 수강생 수 데이터 (실제로는 API에서 가져와야 함)
export const studentCounts = {
  1: 15, // 1기 15명
  2: 20, // 2기 20명
  3: 18  // 3기 18명
};

// 목업 미션 데이터
export const mockMissions: Mission[] = [
  {
    id: 1,
    title: '유튜브 계정 생성 및 기본 설정',
    description: '개인 유튜브 계정을 생성하고 기본적인 채널 정보를 설정해주세요. 채널명, 프로필 이미지 등을 완료 후 [채널 생성 완료] 라고 작성해주세요',
    week: 1,
    dueDate: '2024-05-07',
    isActive: true,
    cohort: 1,
    submissions: [
      {
        id: 1,
        missionId: 1,
        studentName: '김수강생',
        studentId: 'student',
        submittedAt: '2024-04-26 14:30',
        fileName: '1주차_미션_김수강생.pdf',
        fileSize: '2.3MB',
        status: 'submitted'
      },
      {
        id: 11,
        missionId: 1,
        studentName: '박수강생',
        studentId: 'student2',
        submittedAt: '2024-04-28 10:15',
        fileName: '1주차_미션_박수강생.pdf',
        fileSize: '1.8MB',
        status: 'submitted'
      }
    ]
  },
  {
    id: 2,
    title: '경쟁 채널 분석 보고서',
    description: '본인과 유사한 콘텐츠를 제작하는 채널 3개를 선정하여 분석하고 인사이트를 도출해주세요.',
    week: 1,
    dueDate: '2024-05-07',
    isActive: true,
    cohort: 1,
    submissions: [
      {
        id: 2,
        missionId: 2,
        studentName: '김수강생',
        studentId: 'student',
        submittedAt: '2024-04-30 16:45',
        fileName: '경쟁채널분석_김수강생.pdf',
        fileSize: '4.1MB',
        status: 'submitted'
      }
    ]
  },
  {
    id: 3,
    title: '2주차 미션: 콘텐츠 기획',
    description: '첫 번째 쇼츠 콘텐츠를 기획하고 스크립트를 작성해주세요.',
    week: 2,
    dueDate: '2024-05-14',
    isActive: true,
    cohort: 1,
    submissions: []
  },
  {
    id: 4,
    title: '채널 브랜딩 미션',
    description: '채널의 정체성을 확립하고 일관된 브랜딩 전략을 수립해주세요.',
    week: 1,
    dueDate: '2024-08-25',
    isActive: true,
    cohort: 2,
    submissions: [
      {
        id: 21,
        missionId: 4,
        studentName: '이수강생',
        studentId: 'student_2_1',
        submittedAt: '2024-08-20 14:20',
        fileName: '브랜딩미션_이수강생.pdf',
        fileSize: '3.2MB',
        status: 'submitted'
      },
      {
        id: 22,
        missionId: 4,
        studentName: '최수강생',
        studentId: 'student_2_2',
        submittedAt: '2024-08-21 09:30',
        fileName: '브랜딩미션_최수강생.pdf',
        fileSize: '2.7MB',
        status: 'submitted'
      },
      {
        id: 23,
        missionId: 4,
        studentName: '정수강생',
        studentId: 'student_2_3',
        submittedAt: '2024-08-22 16:45',
        fileName: '브랜딩미션_정수강생.pdf',
        fileSize: '4.1MB',
        status: 'submitted'
      }
    ]
  },
  {
    id: 5,
    title: '트렌드 분석 리포트',
    description: '현재 유튜브 쇼츠에서 인기 있는 트렌드를 분석하고 본인만의 콘텐츠 아이디어를 제안해주세요.',
    week: 2,
    dueDate: '2024-09-01',
    isActive: true,
    cohort: 2,
    submissions: [
      {
        id: 24,
        missionId: 5,
        studentName: '이수강생',
        studentId: 'student_2_1',
        submittedAt: '2024-08-25 11:30',
        fileName: '트렌드분석_이수강생.pdf',
        fileSize: '5.4MB',
        status: 'submitted'
      }
    ]
  }
];