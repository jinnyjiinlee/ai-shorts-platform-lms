# LMS Platform - 프로젝트 구조

## 📁 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # 라우트 폴더들
│   │   ├── admin/               # 관리자 페이지
│   │   ├── auth/                # 인증 페이지 (회원가입, 로그인)
│   │   └── student/             # 학생 페이지
│   ├── components/              # 페이지별 컴포넌트
│   │   ├── admin/               # 관리자 전용 컴포넌트
│   │   ├── auth/                # 인증 관련 컴포넌트
│   │   ├── student/             # 학생 전용 컴포넌트
│   │   ├── shared/              # 공통 컴포넌트
│   │   └── ui/                  # 재사용 가능한 UI 컴포넌트
│   ├── globals.css              # 글로벌 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 홈 페이지
├── lib/                         # 핵심 비즈니스 로직
│   ├── services/                # 서비스 레이어
│   │   ├── dashboard/           # 대시보드 서비스
│   │   ├── missions/            # 미션 관련 서비스
│   │   └── tracking/            # 진도 추적 서비스
│   ├── hooks/                   # 커스텀 훅
│   │   ├── auth/                # 인증 관련 훅
│   │   ├── admin/               # 관리자 훅
│   │   ├── student/             # 학생 훅
│   │   └── common/              # 공통 훅
│   ├── types/                   # TypeScript 타입 정의
│   │   ├── auth.types.ts        # 인증 관련 타입
│   │   ├── user.types.ts        # 사용자 관련 타입
│   │   ├── mission.types.ts     # 미션 관련 타입
│   │   ├── dashboard.types.ts   # 대시보드 관련 타입
│   │   └── index.ts             # 타입 통합 export
│   ├── utils/                   # 유틸리티 함수
│   │   ├── missionUtils.ts      # 미션 관련 유틸
│   │   ├── validationUtils.tsx  # 검증 유틸
│   │   └── index.ts             # 유틸 통합 export
│   ├── constants/               # 상수 정의
│   │   ├── routes.ts            # 라우트 상수
│   │   └── userRoles.ts         # 사용자 역할/상태 상수
│   ├── supabase/               # Supabase 관련
│   │   ├── client.ts           # Supabase 클라이언트
│   │   └── auth.ts             # 인증 함수
│   └── index.ts                # 메인 export 파일
├── __mocks__/                  # 개발용 Mock 데이터
│   ├── missions.mock.ts        # 미션 목 데이터
│   ├── dashboard.mock.ts       # 대시보드 목 데이터
│   └── announcements.mock.ts   # 공지사항 목 데이터
└── ...
```

## 🎯 구조 개선사항

### 1. 서비스 레이어 통합
- **Before**: 여러 폴더에 산재된 서비스 파일들
- **After**: `src/lib/services/` 하위로 기능별 통합

### 2. 훅 중앙화
- **Before**: 각 컴포넌트 폴더에 개별적으로 위치
- **After**: `src/lib/hooks/` 하위로 역할별 정리

### 3. 타입 정의 표준화
- **Before**: 각 파일에 분산된 타입 정의
- **After**: `src/lib/types/` 하위로 기능별 통합

### 4. 유틸리티 함수 정리
- **Before**: 각 컴포넌트 폴더에 개별적으로 위치
- **After**: `src/lib/utils/` 하위로 중앙 집중

### 5. 상수 관리
- **Before**: 하드코딩된 값들
- **After**: `src/lib/constants/` 하위로 체계적 관리

## 📦 Import 패턴

### 추천 Import 방식
```typescript
// 타입 import
import { User, Mission, ApiResponse } from '@/lib/types';

// 서비스 import
import { adminDashboardService } from '@/lib/services';

// 훅 import
import { useLogin, useMissionManagement } from '@/lib/hooks';

// 상수 import
import { ROUTES, USER_ROLES } from '@/lib/constants';

// 유틸리티 import
import { validateMission } from '@/lib/utils';
```

### Index 파일 활용
각 폴더의 `index.ts` 파일을 통해 깔끔한 import 제공:
- `src/lib/index.ts`: 모든 핵심 export 통합
- `src/lib/services/index.ts`: 모든 서비스 통합
- `src/lib/hooks/index.ts`: 모든 훅 통합
- `src/lib/types/index.ts`: 모든 타입 통합

## 🔍 주요 개선 효과

1. **가독성 향상**: 기능별로 명확하게 분리된 구조
2. **유지보수성**: 관련 파일들이 같은 위치에 그룹화
3. **재사용성**: 공통 기능의 중앙 집중 관리
4. **일관성**: 표준화된 import 패턴
5. **확장성**: 새로운 기능 추가 시 명확한 위치 제공

## 💡 개발 가이드라인

1. **새로운 서비스 추가**: `src/lib/services/` 하위 적절한 폴더에 추가
2. **새로운 훅 생성**: `src/lib/hooks/` 하위 역할별 폴더에 추가
3. **타입 정의**: `src/lib/types/` 하위 기능별 파일에 추가
4. **상수 관리**: `src/lib/constants/` 하위에 목적별로 정리
5. **Mock 데이터**: `src/__mocks__/` 하위에 `.mock.ts` 확장자로 추가