'use client';

import {
  DocumentIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/features/shared/ui/Badge';

interface LearningMaterial {
  id: number;
  title: string;
  description: string;
  week: number;
  cohort: string;
  uploadDate: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  isPublished: boolean;
}

interface MaterialCardProps {
  material: LearningMaterial;
  userRole: 'admin' | 'student';
  onView: (material: LearningMaterial) => void;
  onEdit: (material: LearningMaterial) => void;
  onDelete: (materialId: number) => void;
  onDownload: (material: LearningMaterial) => void;
  onTogglePublished: (materialId: number) => void;
}

export default function MaterialCard({
  material,
  userRole,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onTogglePublished
}: MaterialCardProps) {
  const getFileIcon = (fileType: string) => {
    return <DocumentIcon className="w-5 h-5" />;
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-slate-900">{material.title}</h3>
            <Badge variant='info' size='sm'>
              {material.week}주차
            </Badge>
            <Badge variant='info' size='sm'>
              {material.cohort}기
            </Badge>
            {userRole === 'admin' && (
              <Badge variant={material.isPublished ? 'success' : 'default'} size='sm'>
                {material.isPublished ? '공개' : '비공개'}
              </Badge>
            )}
          </div>
          
          <div 
            className="text-slate-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: material.description }}
          />
          
          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              {getFileIcon(material.fileType)}
              <span>{material.fileName} ({material.fileSize})</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{material.uploadDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(material)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="상세보기"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onDownload(material)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="다운로드"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          
          {userRole === 'admin' && (
            <>
              <button
                onClick={() => onEdit(material)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                title="수정"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onTogglePublished(material.id)}
                className={`p-2 rounded-lg transition-colors ${
                  material.isPublished
                    ? 'text-gray-600 hover:bg-gray-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                title={material.isPublished ? '비공개로 변경' : '공개로 변경'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={material.isPublished ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"}
                  />
                </svg>
              </button>
              
              <button
                onClick={() => onDelete(material.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}