'use client';

import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  views: number;
}

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onView: (announcement: Announcement) => void;
}

export default function AnnouncementList({
  announcements,
  onEdit,
  onDelete,
  onView
}: AnnouncementListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50">
          📢
        </div>
        <p className="text-lg text-slate-600 mb-2">등록된 공지사항이 없습니다.</p>
        <p className="text-sm text-slate-500">새로운 공지사항을 추가해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
            announcement.isImportant ? 'border-red-200 bg-red-50' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {announcement.title}
                </h3>
                {announcement.isImportant && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    중요
                  </span>
                )}
              </div>
              
              <p className="text-slate-600 text-sm mb-4">
                {truncateContent(announcement.content)}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span>{formatDate(announcement.createdAt)}</span>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-3 h-3" />
                  <span>{announcement.views}회 조회</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onView(announcement)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="미리보기"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onEdit(announcement)}
                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="수정"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  if (confirm('이 공지사항을 삭제하시겠습니까?')) {
                    onDelete(announcement.id);
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="삭제"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}