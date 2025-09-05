'use client';

import { CheckCircleIcon, EyeIcon, SparklesIcon, LockClosedIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/features/shared/ui/Badge';
import { MissionCardProps } from '../types';

export default function MissionCard({ mission, onClick }: MissionCardProps) {
  // 마감일이 지났는지 확인
  const isOverdue = mission.due_date ? new Date(mission.due_date) < new Date() : false;
  
  // 상태 결정: 제출완료 > 마감 > 진행중
  const getStatusInfo = () => {
    if (mission.isSubmitted) {
      return { 
        text: '완료', 
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: <SparklesIcon className='w-3 h-3' />
      };
    } else if (isOverdue) {
      return { 
        text: '마감', 
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: <LockClosedIcon className='w-3 h-3' />
      };
    } else {
      return { 
        text: '진행중', 
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: <BoltIcon className='w-3 h-3' />
      };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className='group'>
      <div
        className='flex items-start space-x-4 p-6 rounded-2xl border-2 border-slate-100 transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:border-slate-200 cursor-pointer'
        onClick={() => onClick?.(mission)}
      >
        {/* 아이콘 */}
        <div className='relative flex-shrink-0'>
          <div
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-bold transition-all duration-300 ${
              mission.isSubmitted
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25'
            }`}
          >
            {mission.isSubmitted ? (
              <>
                <CheckCircleIcon className='w-5 h-5 mb-0.5' />
                <span className='text-xs font-bold'>{mission.week}주</span>
              </>
            ) : (
              <>
                <span className='text-lg font-bold'>{mission.week}</span>
                <span className='text-xs'>주차</span>
              </>
            )}
          </div>
          {mission.isSubmitted && (
            <div className='absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center'>
              <SparklesIcon className='w-3 h-3 text-white' />
            </div>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors'>
              {mission.title}
            </h4>
            <div className='flex items-center space-x-2'>
              <Badge 
                variant={mission.isSubmitted ? 'success' : isOverdue ? 'danger' : 'info'}
                size='sm'
                icon={statusInfo.icon}
              >
                {statusInfo.text}
              </Badge>
            </div>
          </div>

          {/* 상세보기 버튼 추가 */}
          <div className='flex items-center space-x-3 mb-3'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(mission);
              }}
              className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg'
            >
              <EyeIcon className='w-4 h-4' />
              <span className='text-sm font-medium'>상세보기</span>
            </button>
            <span className='text-sm text-slate-500'>클릭하여 미션 설명을 확인하세요</span>
          </div>

          {/* 진행률 바 */}
          <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out relative ${
                mission.isSubmitted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: mission.isSubmitted ? '100%' : '0%' }}
            >
              <div className='absolute inset-0 bg-white/20 animate-pulse'></div>
            </div>
          </div>

          <div className='flex items-center justify-between mt-2 text-xs text-slate-500'>
            <span>마감일: {mission.dueDateFormatted}</span>
            {mission.submittedAt && (
              <span className='text-green-600 flex items-center space-x-1'>
                <CheckCircleIcon className='w-3 h-3' />
                <span>{mission.submittedAt} 제출</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}