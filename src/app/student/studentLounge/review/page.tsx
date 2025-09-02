import ReviewBoard from '@/features/shared/studentLounge/review/components/ReviewBoard';

export default function StudentReviewPage() {
  return (
    <div className='p-6'>
      <ReviewBoard userRole='student' />
    </div>
  );
}
