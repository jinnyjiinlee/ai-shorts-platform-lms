'use client';

import { useState } from 'react';
import { MegaphoneIcon, StarIcon } from '@heroicons/react/24/outline';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
  cohort?: number;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedContent = announcement.content.length > 200 
    ? announcement.content.substring(0, 200) + '...'
    : announcement.content;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 group ${
      announcement.isPinned 
        ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50' 
        : 'border-slate-200'
    }`}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            announcement.isPinned
              ? 'bg-gradient-to-br from-amber-500 to-orange-500'
              : 'bg-gradient-to-br from-blue-600 to-indigo-600'
          }`}>
            {announcement.isPinned ? (
              <StarIcon className="w-6 h-6 text-white" />
            ) : (
              <MegaphoneIcon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {announcement.author}
            </h3>
            <p className="text-sm text-slate-500">{announcement.createdAt}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {announcement.isPinned && (
            <div className="px-3 py-1 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full">
              <span className="text-xs font-medium text-amber-800">고정</span>
            </div>
          )}
          {announcement.cohort && (
            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
              <span className="text-xs font-medium text-blue-700">{announcement.cohort}기</span>
            </div>
          )}
          <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
            <span className="text-xs font-medium text-green-700">공지사항</span>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h2 className={`text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors ${
        announcement.isPinned ? 'text-amber-800' : 'text-slate-900'
      }`}>
        {announcement.isPinned && '📌 '}{announcement.title}
      </h2>

      {/* 내용 */}
      <div className="text-slate-700 mb-4 leading-relaxed">
        {isExpanded ? (
          <div className="whitespace-pre-line">{announcement.content}</div>
        ) : (
          <div className="whitespace-pre-line">{truncatedContent}</div>
        )}
        
        {announcement.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`font-medium mt-2 transition-colors ${
              announcement.isPinned
                ? 'text-amber-700 hover:text-amber-900'
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {/* 공지사항은 댓글 기능 없음 */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-sm text-slate-500 text-center">
          📢 공지사항은 댓글을 작성할 수 없습니다
        </div>
      </div>
    </div>
  );
}