import QnABoard from '@/features/shared/studentLounge/qna/components/QnABoard';

export default function StudentQnAPage() {
  return (
    <div className='p-6'>
      <QnABoard userRole='student' cohort='1' />
    </div>
  );
}
