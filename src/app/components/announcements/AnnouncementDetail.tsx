'use client';

import { Announcement } from './types';
import {
  ChevronLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface AnnouncementDetailProps {
  announcement: Announcement;
  onBack: () => void;
}

export default function AnnouncementDetail({ 
  announcement, 
  onBack 
}: AnnouncementDetailProps) {
  
  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      important: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      urgent: '긴급',
      important: '중요',
      normal: '일반'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[priority as keyof typeof badges]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span>목록으로</span>
        </button>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-slate-800">
              {announcement.title}
            </h1>
            {getPriorityBadge(announcement.priority)}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4" />
              <span>{announcement.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{announcement.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TagIcon className="w-4 h-4" />
              <span>{announcement.category}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 본문 */}
      <div className="p-6">
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-slate-700 mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-600 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="ml-4">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-800">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r">
                  {children}
                </blockquote>
              )
            }}
          >
            {announcement.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}