import { useCurrentUser } from '@/features/shared/hooks/useCurrentUser';

interface OwnerOnlyProps {
  children: React.ReactNode; // 작성자일 때 보여줄 내용
  authorId: string; // 글 작성자 ID
  fallback?: React.ReactNode; // 작성자가 아닐 때 대신 보여줄 UI
}

export default function OwnerOnly({ children, authorId, fallback = null }: OwnerOnlyProps) {
  const { currentUserId, loading } = useCurrentUser();

  if (loading) return null; // 로딩 중이면 아무것도 안 보여줌
  if (currentUserId !== authorId) {
    return <>{fallback}</>; // 작성자가 아니면 fallback 보여줌
  }

  return <>{children}</> // 작성자면 children 보여줌
}
