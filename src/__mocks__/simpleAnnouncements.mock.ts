import { Announcement } from '@/features/announcements/types';

export const simpleMockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '3월 특별 라이브 강의 일정 안내',
    summary: '3월 27일 오후 8시에 특별 라이브 강의가 진행됩니다.',
    content: `
# 3월 특별 라이브 강의 일정 안내

안녕하세요, 하대표의 숏폼 수익화 부스트입니다.

## 일정 안내

**일시**: 2024년 3월 27일 (수) 오후 8시

## 라이브 강의 내용

- 3월 미션 우수작 리뷰
- Q&A 세션
- 특별 게스트 초대

감사합니다.`,
    author: '하대표',
    date: '2024-03-23',
    isNew: true,
    priority: 'important',
    category: '라이브 강의'
  },
  {
    id: 2,
    title: '4월 신규 콘텐츠 업데이트',
    summary: '4월부터 새로운 교육 콘텐츠가 추가됩니다.',
    content: `
# 4월 신규 콘텐츠 업데이트

## 새로운 콘텐츠 목록

1. **AI 활용 쇼츠 스크립트 작성법**
   - ChatGPT를 활용한 후크 생성
   - 트렌드 키워드 분석

2. **쇼츠 편집 고급 테크닉**
   - 전환 효과 마스터하기
   - 사운드 디자인

3. **수익화 전략 심화**
   - 광고 수익 최적화
   - 브랜드 협업 전략

모든 콘텐츠는 4월 1일부터 학습자료 페이지에서 확인하실 수 있습니다.`,
    author: '하대표',
    date: '2024-03-22',
    isNew: true,
    priority: 'normal',
    category: '콘텐츠 업데이트'
  },
  {
    id: 3,
    title: '3월 미션 제출 마감일 안내',
    summary: '3월 미션 제출 마감일은 3월 31일 자정까지입니다.',
    content: `
# 3월 미션 제출 마감일 안내

3월 미션 제출 마감일을 다시 한 번 안내드립니다.

**마감일시**: 2024년 3월 31일 23:59

## 제출 방법
1. 미션 페이지에서 제출 버튼 클릭
2. 유튜브 링크 입력
3. 간단한 설명 작성

늦지 않게 제출 부탁드립니다!`,
    author: '관리자',
    date: '2024-03-20',
    isNew: false,
    priority: 'urgent',
    category: '미션 안내'
  }
];