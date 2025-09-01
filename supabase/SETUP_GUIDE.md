# RLS 설정 가이드

## 1. 단계별 설정

### Step 1: Supabase 대시보드에 접속
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 `SQL Editor` 클릭

### Step 2: profiles 테이블 RLS 설정
`supabase/rls-policies/profiles.sql` 파일의 내용을 복사하여 실행:

```sql
-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 정책들 적용...
```

### Step 3: announcements 테이블 RLS 설정  
`supabase/rls-policies/announcements.sql` 파일의 내용을 복사하여 실행:

```sql
-- RLS 활성화
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 정책들 적용...
```

### Step 4: 설정 확인
```sql
-- RLS 활성화 상태 확인
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'announcements');

-- 정책 목록 확인
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'announcements');
```

## 2. 테스트 방법

### 관리자 계정으로 테스트
1. 관리자 계정으로 로그인
2. 개발자 도구 콘솔에서 실행:

```javascript
// 공지사항 생성 테스트
const { data, error } = await supabase
  .from('announcements')
  .insert({
    title: '테스트 공지',
    content: '테스트 내용',
    is_published: true,
    admin_id: supabase.auth.user()?.id
  });

console.log('생성 결과:', { data, error });

// 모든 공지사항 조회 테스트
const { data: announcements, error: selectError } = await supabase
  .from('announcements')
  .select('*');

console.log('조회 결과:', { announcements, selectError });
```

### 학생 계정으로 테스트
1. 학생 계정으로 로그인
2. 개발자 도구 콘솔에서 실행:

```javascript
// 발행된 공지사항만 조회 가능 테스트
const { data: announcements, error } = await supabase
  .from('announcements')
  .select('*');

console.log('학생 조회 결과:', { announcements, error });

// 공지사항 생성 시도 (실패해야 함)
const { data, error: insertError } = await supabase
  .from('announcements')
  .insert({
    title: '학생이 만든 공지',
    content: '내용',
    is_published: true
  });

console.log('학생 생성 시도 결과:', { data, insertError }); // 에러 발생해야 함
```

## 3. 일반적인 문제 해결

### 문제 1: "permission denied for table" 에러
**원인**: RLS가 활성화되었지만 정책이 없거나 잘못 설정됨
**해결**: 정책을 다시 확인하고 올바른 조건 설정

### 문제 2: 관리자인데도 접근 안됨
**원인**: profiles.role이 'admin'으로 설정되지 않음
**해결**: 
```sql
UPDATE profiles SET role = 'admin' WHERE email = '관리자이메일@example.com';
```

### 문제 3: 학생이 모든 공지를 볼 수 있음
**원인**: is_published 체크가 제대로 안됨
**해결**: announcements 테이블에 is_published 컬럼이 있는지 확인

### 문제 4: 헬퍼 함수 오류
**원인**: is_admin(), is_student() 함수가 생성되지 않음
**해결**: announcements.sql 파일의 함수 생성 부분을 다시 실행

## 4. 보안 체크리스트

- [ ] RLS가 모든 테이블에서 활성화됨
- [ ] 관리자만 생성/수정/삭제 가능
- [ ] 학생은 발행된 공지사항만 조회 가능
- [ ] 인증되지 않은 사용자는 접근 불가
- [ ] profiles.role이 올바르게 설정됨
- [ ] 헬퍼 함수들이 정상 작동함

## 5. 모니터링

### 정책 실행 로그 확인
```sql
-- 최근 RLS 정책 실행 로그
SELECT * FROM pg_stat_user_tables WHERE relname IN ('profiles', 'announcements');
```

### 사용자 역할 분포 확인
```sql
SELECT role, COUNT(*) as count 
FROM profiles 
GROUP BY role;
```

### 공지사항 상태 분포 확인  
```sql
SELECT 
  is_published,
  is_pinned,
  COUNT(*) as count
FROM announcements 
GROUP BY is_published, is_pinned;
```

## 6. 백업 및 복구

### 정책 백업
```bash
# 정책 백업
pg_dump --schema-only --table=pg_policies your_db > rls_policies_backup.sql
```

### 정책 초기화 (위험!)
```sql
-- 모든 정책 삭제 (주의!)
DROP POLICY IF EXISTS "announcements_select_policy" ON announcements;
DROP POLICY IF EXISTS "announcements_insert_policy" ON announcements;
-- ... (모든 정책 삭제)

-- RLS 비활성화 (임시)
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```