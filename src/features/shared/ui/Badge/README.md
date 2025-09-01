# 배지 컴포넌트들 (Badge Components)

재사용 가능한 배지 컴포넌트 모음입니다. 미션, 과제, 학습자료 등에서 일관성 있는 UI를 제공합니다.

## 컴포넌트 목록

### 1. WeekBadge (주차 배지)
주차 정보를 표시하는 배지입니다.

```tsx
import { WeekBadge } from '@/features/shared/ui/Badge';

// 기본 사용법
<WeekBadge week={1} />

// 다양한 옵션
<WeekBadge 
  week={3}
  size="lg"
  variant="gradient"
  theme="blue-cyan"
  format="주차"
  onClick={() => console.log('3주차 클릭')}
/>
```

**Props:**
- `week`: 주차 번호 (필수)
- `size`: 크기 ('sm' | 'md' | 'lg')
- `variant`: 스타일 ('gradient' | 'solid' | 'outline')
- `theme`: 색상 테마 ('indigo-purple' | 'blue-cyan' | 'emerald-teal' | 'orange-red')
- `format`: 텍스트 형식 ('W' | '주차' | 'week')
- `interactive`: 호버 효과 (기본값: true)

### 2. DifficultyBadge (난이도 배지)
미션 난이도를 표시하는 배지입니다.

```tsx
import { DifficultyBadge } from '@/features/shared/ui/Badge';

// 기본 사용법
<DifficultyBadge difficulty="easy" />
<DifficultyBadge difficulty="medium" />
<DifficultyBadge difficulty="hard" />

// 영어 표시
<DifficultyBadge 
  difficulty="medium"
  format="english"
  variant="outline"
/>

// 아이콘으로 표시
<DifficultyBadge 
  difficulty="easy"
  format="icon"
  size="lg"
/>
```

**Props:**
- `difficulty`: 난이도 ('easy' | 'medium' | 'hard') (필수)
- `size`: 크기 ('sm' | 'md' | 'lg')
- `variant`: 스타일 ('gradient' | 'solid' | 'outline')
- `format`: 텍스트 형식 ('korean' | 'english' | 'icon')

### 3. PointsBadge (포인트 배지)
점수나 포인트를 표시하는 배지입니다.

```tsx
import { PointsBadge } from '@/features/shared/ui/Badge';

// 기본 사용법
<PointsBadge points={100} />

// 다른 테마와 형식
<PointsBadge 
  points={250}
  theme="gold"
  format="points"
  size="lg"
/>
```

**Props:**
- `points`: 포인트 수 (필수)
- `size`: 크기 ('sm' | 'md' | 'lg')
- `variant`: 스타일 ('gradient' | 'solid' | 'outline')
- `theme`: 색상 테마 ('violet-purple' | 'blue-indigo' | 'emerald-teal' | 'gold')
- `format`: 텍스트 형식 ('점' | 'points' | 'pt')

## 사용 예시

### 미션 카드에서 사용
```tsx
function MissionCard({ mission }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{mission.title}</h3>
      <div className="flex gap-2 mt-2">
        <WeekBadge week={mission.week} />
        <DifficultyBadge difficulty={mission.difficulty} />
        <PointsBadge points={mission.points} />
      </div>
    </div>
  );
}
```

### 테이블에서 사용
```tsx
function MissionTable({ missions }) {
  return (
    <table>
      {missions.map(mission => (
        <tr key={mission.id}>
          <td>
            <WeekBadge week={mission.week} size="sm" />
            {mission.title}
          </td>
          <td>
            <DifficultyBadge difficulty={mission.difficulty} size="sm" />
          </td>
          <td>
            <PointsBadge points={mission.points} size="sm" />
          </td>
        </tr>
      ))}
    </table>
  );
}
```

## 스타일 커스터마이징

모든 배지는 `className` prop을 통해 추가 스타일을 적용할 수 있습니다:

```tsx
<WeekBadge 
  week={1}
  className="ml-2 border-2 border-blue-300"
/>
```

## 반응형 디자인

크기를 반응형으로 조절하고 싶을 때:

```tsx
<WeekBadge 
  week={1}
  className="text-xs sm:text-sm md:text-base"
  size="sm"
/>
```