'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '../../../lib/hooks/common/useDebounce';
import { SpeakerWaveIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { Announcement } from './types';
import { mockAnnouncements } from './mockData';
import AnnouncementList from './AnnouncementList';
import AnnouncementDetail from './AnnouncementDetail';
import AnnouncementSearch from './AnnouncementSearch';

export default function AnnouncementView() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = new Set(announcements.map(a => a.category));
    return Array.from(uniqueCategories);
  }, [announcements]);

  // 필터링된 공지사항
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           announcement.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [announcements, debouncedSearchTerm, selectedCategory, selectedPriority]);

  // 우선순위별 정렬
  const sortedAnnouncements = useMemo(() => {
    const priorityOrder = { urgent: 0, important: 1, normal: 2 };
    return [...filteredAnnouncements].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [filteredAnnouncements]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellAlertIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">공지사항</h1>
              <p className="text-blue-100">중요한 소식과 업데이트를 확인하세요</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm">전체 공지</p>
            <p className="text-2xl font-bold">{announcements.length}</p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <AnnouncementSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 공지사항 목록 */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4 max-h-[600px] overflow-y-auto">
          <div className="mb-4 pb-3 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">
              공지 목록 ({sortedAnnouncements.length})
            </h2>
          </div>
          <AnnouncementList
            announcements={sortedAnnouncements}
            selectedId={selectedAnnouncement?.id}
            onSelect={setSelectedAnnouncement}
          />
        </div>

        {/* 공지사항 상세 */}
        <div className="lg:col-span-2">
          {selectedAnnouncement ? (
            <AnnouncementDetail
              announcement={selectedAnnouncement}
              onBack={() => setSelectedAnnouncement(null)}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <SpeakerWaveIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">공지사항을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}