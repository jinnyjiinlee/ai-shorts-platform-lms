// 사용 예시: 미션 공지에서 범용 게시판 사용하기

'use client';

import { useState } from 'react';
import MissionBoard from './MissionBoard';
import { Mission } from '@/types/domains/mission';

export default function MissionBoardExample() {
  // 임시 미션 데이터
  const [missions] = useState<Mission[]>([
    {
      id: '1',
      title: '1주차 HTML/CSS 기초 미션',
      description: '웹 개발의 기초인 HTML과 CSS를 학습하고 간단한 웹페이지를 만들어보세요.',
      content: '# 1주차 미션\n\n이번 주는 HTML과 CSS의 기초를 다룹니다.\n\n## 학습 목표\n- HTML 태그 이해하기\n- CSS 스타일링 기초\n\n## 제출 방법\n코드와 함께 스크린샷을 제출해주세요.',
      status: 'published' as const,
      category: '웹개발',
      points: 100,
      difficulty: 'easy' as const,
      created_at: '2025-09-01T10:00:00Z',
      updated_at: '2025-09-01T10:00:00Z',
      created_by: 'admin',
      due_date: '2025-09-08T23:59:59Z',
      cohort: '1',
      week: 1,
    },
    {
      id: '2',
      title: '2주차 JavaScript 기초 미션',
      description: 'JavaScript의 기본 문법과 DOM 조작을 학습합니다.',
      content: '# 2주차 미션\n\nJavaScript 기초를 학습해봅시다.',
      status: 'draft' as const,
      category: '웹개발',
      points: 150,
      difficulty: 'medium' as const,
      created_at: '2025-09-01T11:00:00Z',
      updated_at: '2025-09-01T11:00:00Z',
      created_by: 'admin',
      due_date: '2025-09-15T23:59:59Z',
      cohort: '1',
      week: 2,
    }
  ]);

  const handleCreateMission = () => {
    console.log('새 미션 작성');
  };

  const handleViewMission = (mission: Mission) => {
    console.log('미션 상세보기:', mission);
  };

  const handleEditMission = (mission: Mission) => {
    console.log('미션 수정:', mission);
  };

  const handleDeleteMission = (id: string) => {
    console.log('미션 삭제:', id);
  };

  return (
    <div className="p-6">
      <MissionBoard
        missions={missions}
        userRole="admin"
        onCreateMission={handleCreateMission}
        onViewMission={handleViewMission}
        onEditMission={handleEditMission}
        onDeleteMission={handleDeleteMission}
      />
    </div>
  );
}