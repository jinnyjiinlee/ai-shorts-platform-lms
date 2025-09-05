export interface UserAvatarProps {
  user: {
    id: string;
    nickname?: string;
    avatarUrl?: string | null;
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}
