'use client';

import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { UserAvatarProps } from './types';

const sizeClasses = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-9 h-9',
};

export default function UserAvatar({
  user,
  size = 'md',
  showTooltip = false,
  className = '',
  onClick,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const shouldShowImage = user.avatarUrl && !imageError;

  const avatar = (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-200 
  flex items-center justify-center ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
    >
      {shouldShowImage ? (
        <img
          src={user.avatarUrl || ''}
          alt={user.nickname || '사용자'}
          className='w-full h-full object-cover'
          onError={() => setImageError(true)}
        />
      ) : (
        <UserIcon className={`${iconSizes[size]} text-slate-500`} />
      )}
    </div>
  );

  if (showTooltip && user.nickname) {
    return (
      <div className='relative group'>
        {avatar}
        <div
          className='absolute bottom-full left-1/2 transform -translate-x-1/2 
  mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 
  group-hover:opacity-100 transition-opacity whitespace-nowrap'
        >
          {user.nickname}
        </div>
      </div>
    );
  }

  return avatar;
}
