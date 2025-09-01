import GrowthDiaryBoard from '@/features/shared/growthDiary/components/GrowthDiaryBoard';

export default function AdminGrowthDiaryPage() {
  return (
    <div className='p-6'>
      <GrowthDiaryBoard userRole='admin' cohort='1' />
    </div>
  );
}
