'use client';

import { PencilIcon, TrashIcon, EyeIcon, CheckCircleIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Mission {
  id: number;
  title: string;
  description: string;
  week: number;
  dueDate: string;
  isActive: boolean;
  submissions: Submission[];
  cohort?: number;
}

interface Submission {
  id: number;
  missionId: number;
  studentName: string;
  studentId: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  status: 'submitted';
}

interface MissionCardProps {
  mission: Mission;
  onEdit: (mission: Mission) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onViewSubmissions: (mission: Mission) => void;
}

export default function MissionCard({ mission, onEdit, onDelete, onToggleActive, onViewSubmissions }: MissionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">{mission.title}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {mission.week}주차
            </span>
            {mission.cohort && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {mission.cohort}기
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              mission.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {mission.isActive ? '활성' : '비활성'}
            </span>
          </div>
          
          <p className="text-slate-600 mb-3 line-clamp-2 whitespace-pre-line">{mission.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>마감: {mission.dueDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="w-4 h-4" />
              <span>제출한 학생: {mission.submissions.length}명</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onViewSubmissions(mission)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="제출 현황"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onEdit(mission)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="수정"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onToggleActive(mission.id)}
            className={`p-2 rounded-lg transition-colors ${
              mission.isActive
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={mission.isActive ? '비활성화' : '활성화'}
          >
            <CheckCircleIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onDelete(mission.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}