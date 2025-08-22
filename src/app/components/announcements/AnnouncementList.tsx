'use client';

import { Announcement } from './types';
import {
  SpeakerWaveIcon,
  CalendarIcon,
  BellAlertIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

interface AnnouncementListProps {
  announcements: Announcement[];
  selectedId?: number | null;
  onSelect: (announcement: Announcement) => void;
}

export default function AnnouncementList({ 
  announcements, 
  selectedId, 
  onSelect 
}: AnnouncementListProps) {
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'important':
        return <InformationCircleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <MegaphoneIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'important':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '일정변경': 'bg-purple-100 text-purple-700',
      '콘텐츠': 'bg-green-100 text-green-700',
      '미션': 'bg-blue-100 text-blue-700',
      '시스템': 'bg-gray-100 text-gray-700',
      '기타': 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <SpeakerWaveIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          onClick={() => onSelect(announcement)}
          className={`
            p-4 rounded-lg cursor-pointer transition-all
            ${getPriorityClass(announcement.priority)}
            ${selectedId === announcement.id 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-md'
            }
            ${announcement.isNew ? 'relative' : ''}
          `}
        >
          {announcement.isNew && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-2">
              {getPriorityIcon(announcement.priority)}
              <h3 className="font-semibold text-slate-800 flex-1">
                {announcement.title}
              </h3>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${getCategoryColor(announcement.category)}
            `}>
              {announcement.category}
            </span>
          </div>
          
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {announcement.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{announcement.date}</span>
              </span>
              <span>작성자: {announcement.author}</span>
            </div>
            {announcement.priority === 'urgent' && (
              <span className="text-red-600 font-semibold animate-pulse">
                긴급
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}