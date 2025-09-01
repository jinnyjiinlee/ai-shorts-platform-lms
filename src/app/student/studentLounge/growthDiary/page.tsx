import GrowthDiaryBoard from '@/features/shared/growthDiary/components/GrowthDiaryBoard';

export default function StudentGrowthDiaryPage() {
  return (
    <div className='p-6'>
      <GrowthDiaryBoard userRole='student' cohort='1' />
    </div>
  );
}
