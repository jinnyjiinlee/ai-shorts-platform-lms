'use client';

import { Announcement } from './types';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface SimpleAnnouncementListProps {
  announcements: Announcement[];
  selectedId?: number | null;
  onSelect: (announcement: Announcement) => void;
}

export default function SimpleAnnouncementList({ 
  announcements, 
  selectedId, 
  onSelect 
}: SimpleAnnouncementListProps) {
  
  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          onClick={() => onSelect(announcement)}
          className={`
            p-4 rounded-lg cursor-pointer transition-all bg-white border
            ${selectedId === announcement.id 
              ? 'border-purple-500 shadow-md' 
              : 'border-slate-200 hover:border-purple-300 hover:shadow-sm'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-slate-800 flex-1">
              {announcement.title}
              {announcement.isNew && (
                <span className="ml-2 inline-block px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                  NEW
                </span>
              )}
            </h3>
          </div>
          
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {announcement.summary}
          </p>
          
          <div className="flex items-center mt-3 text-xs text-slate-500">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>{announcement.date}</span>
            <span className="mx-2">·</span>
            <span>{announcement.author}</span>
          </div>
        </div>
      ))}
    </div>
  );
}