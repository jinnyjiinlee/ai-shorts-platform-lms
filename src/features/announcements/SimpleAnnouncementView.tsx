'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '@/lib/hooks/common/useDebounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Announcement } from './types';
import { simpleMockAnnouncements } from './SimpleMockData';
import SimpleAnnouncementList from './SimpleAnnouncementList';
import AnnouncementDetail from './AnnouncementDetail';

export default function SimpleAnnouncementView() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements] = useState<Announcement[]>(simpleMockAnnouncements);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 필터링된 공지사항
  const filteredAnnouncements = useMemo(() => {
    if (!debouncedSearchTerm) return announcements;
    
    return announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      announcement.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [announcements, debouncedSearchTerm]);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <p className="text-purple-100 mt-1">중요한 소식을 확인하세요</p>
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
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 공지사항 목록 */}
        <div className="lg:col-span-1">
          <SimpleAnnouncementList
            announcements={filteredAnnouncements}
            selectedId={selectedAnnouncement?.id}
            onSelect={setSelectedAnnouncement}
          />
        </div>

        {/* 공지사항 상세 */}
        <div className="lg:col-span-2">
          {selectedAnnouncement ? (
            <AnnouncementDetail
              announcement={selectedAnnouncement as any}
              onBack={() => setSelectedAnnouncement(null)}
            />
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-500">공지사항을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}