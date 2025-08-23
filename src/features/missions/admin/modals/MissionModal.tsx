'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../../editor/MarkdownEditor';

interface Mission {
  id: number;
  title: string;
  description: string;
  week: number;
  dueDate: string;
  isActive: boolean;
  submissions: any[];
  cohort?: number;
}

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: Mission | null;
  formData: {
    title: string;
    description: string;
    week: number;
    dueDate: string;
    cohort: number;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  availableWeeks: number[];
  availableCohorts: number[];
}

export default function MissionModal({
  isOpen,
  onClose,
  mission,
  formData,
  onFormDataChange,
  onSubmit,
  availableWeeks,
  availableCohorts
}: MissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-slate-900">
              {mission ? '미션 수정' : '새 미션 생성'}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">미션 제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="미션 제목을 입력하세요"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">미션 설명</label>
            <MarkdownEditor
              value={formData.description}
              onChange={(value: string) => onFormDataChange({...formData, description: value})}
              placeholder="마크다운으로 미션에 대한 자세한 설명을 입력하세요"
              className="min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">주차</label>
              <select
                value={formData.week}
                onChange={(e) => onFormDataChange({...formData, week: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableWeeks.map(week => (
                  <option key={week} value={week}>{week}주차</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">기수</label>
              <select
                value={formData.cohort}
                onChange={(e) => onFormDataChange({...formData, cohort: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableCohorts.map(cohort => (
                  <option key={cohort} value={cohort}>{cohort}기</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">마감일</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => onFormDataChange({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mission ? '수정' : '생성'} 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}