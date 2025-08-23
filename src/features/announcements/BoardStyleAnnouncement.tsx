'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '@/lib/hooks/common/useDebounce';
import { MagnifyingGlassIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Announcement } from './types';
import { simpleMockAnnouncements } from '@/__mocks__/simpleAnnouncements.mock';
import ReactMarkdown from 'react-markdown';

export default function BoardStyleAnnouncement() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements] = useState<Announcement[]>(simpleMockAnnouncements);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAnnouncements = useMemo(() => {
    if (!debouncedSearchTerm) return announcements;
    
    return announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [announcements, debouncedSearchTerm]);

  if (selectedAnnouncement) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <button
            onClick={() => setSelectedAnnouncement(null)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>목록으로</span>
          </button>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{selectedAnnouncement.title}</h1>
          <div className="flex items-center space-x-3 text-sm text-slate-500 mb-6">
            <span>{selectedAnnouncement.date}</span>
            <span>·</span>
            <span>{selectedAnnouncement.author}</span>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{selectedAnnouncement.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">공지사항</h1>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="공지사항 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 게시판 형식 목록 */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-slate-600">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-7">제목</div>
            <div className="col-span-2 text-center">작성자</div>
            <div className="col-span-2 text-center">날짜</div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {filteredAnnouncements.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredAnnouncements.map((announcement, index) => (
              <div
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="col-span-1 text-center text-sm text-slate-600">
                  {filteredAnnouncements.length - index}
                </div>
                <div className="col-span-7">
                  <span className="text-sm text-slate-800 hover:text-blue-600">
                    {announcement.title}
                    {announcement.isNew && (
                      <span className="ml-2 text-xs text-red-500">NEW</span>
                    )}
                  </span>
                </div>
                <div className="col-span-2 text-center text-sm text-slate-600">
                  {announcement.author}
                </div>
                <div className="col-span-2 text-center text-sm text-slate-600">
                  {announcement.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}