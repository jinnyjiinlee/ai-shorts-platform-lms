import CommunityView from '@/features/community/CommunityView';

export default function AdminCommunityPage() {
  return <CommunityView userRole="admin" currentUser="관리자" />;
}
