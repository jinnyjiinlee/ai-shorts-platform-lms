'use client';

import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='w-full max-w-7xl mx-auto px-6 py-6'>
        {/* 메인 헤더 스켈레톤 */}
        <div className='mb-12'>
          <div className='h-9 bg-slate-200 rounded w-64 mb-3 animate-pulse'></div>
          <div className='h-6 bg-slate-100 rounded w-96 animate-pulse'></div>
        </div>

        {/* 상단 핵심 지표 카드들 스켈레톤 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm min-h-[120px]'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-10 h-10 bg-slate-200 rounded-lg animate-pulse'></div>
                <div className='h-3 w-12 bg-slate-100 rounded animate-pulse'></div>
              </div>
              <div className='h-8 w-16 bg-slate-200 rounded mb-3 animate-pulse'></div>
              <div className='h-2 w-full bg-slate-100 rounded animate-pulse'></div>
            </div>
          ))}
        </div>

        {/* 메인 컨텐츠 영역 스켈레톤 */}
        <div className='grid grid-cols-1 lg:grid-cols-13 gap-8'>
          {/* 왼쪽: 전체 진행 상황 스켈레톤 */}
          <div className='lg:col-span-8'>
            <div className='bg-white rounded-xl border border-slate-200/50 shadow-sm p-8 h-full'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <div className='h-6 w-48 bg-slate-200 rounded mb-2 animate-pulse'></div>
                  <div className='h-4 w-32 bg-slate-100 rounded animate-pulse'></div>
                </div>
                <div>
                  <div className='h-4 w-16 bg-slate-100 rounded mb-1 animate-pulse'></div>
                  <div className='h-6 w-20 bg-slate-200 rounded animate-pulse'></div>
                </div>
              </div>

              {/* 대형 진행률 바 스켈레톤 */}
              <div className='bg-slate-100 rounded-2xl p-6'>
                <div className='w-full bg-white rounded-xl h-8 animate-pulse'></div>
                <div className='flex justify-between mt-6'>
                  <div className='h-4 w-20 bg-slate-200 rounded animate-pulse'></div>
                  <div className='h-4 w-24 bg-slate-200 rounded animate-pulse'></div>
                </div>
              </div>

              {/* 주차별 진도 스켈레톤 */}
              <div className='mt-8'>
                <div className='h-5 w-32 bg-slate-200 rounded mb-4 animate-pulse'></div>
                <div className='grid grid-cols-10 gap-2'>
                  {Array.from({ length: 17 }).map((_, i) => (
                    <div key={i} className='h-10 bg-slate-100 rounded-lg animate-pulse'></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 이번주 미션 스켈레톤 */}
          <div className='lg:col-span-5'>
            <div className='bg-white rounded-xl border border-slate-200/50 shadow-sm h-full flex flex-col'>
              {/* 헤더 스켈레톤 */}
              <div className='px-6 py-4 border-b border-slate-100/50'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='h-6 w-24 bg-slate-200 rounded mb-2 animate-pulse'></div>
                    <div className='h-4 w-16 bg-slate-100 rounded animate-pulse'></div>
                    <div className='flex items-center space-x-4 mt-3'>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='text-center'>
                          <div className='h-6 w-8 bg-slate-200 rounded mb-1 animate-pulse'></div>
                          <div className='h-3 w-10 bg-slate-100 rounded animate-pulse'></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='w-6 h-6 bg-slate-100 rounded animate-pulse'></div>
                </div>
              </div>

              {/* 진행률 바 스켈레톤 */}
              <div className='px-6 py-3 bg-slate-50/30'>
                <div className='w-full h-2 bg-slate-200 rounded-full animate-pulse'></div>
              </div>

              {/* 미션 목록 스켈레톤 */}
              <div className='px-6 py-4 flex-1'>
                <div className='grid grid-cols-2 gap-3'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className='p-3 rounded-lg border border-slate-200 min-h-[80px] flex flex-col justify-between'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <div className='w-2 h-2 bg-slate-200 rounded-full animate-pulse'></div>
                        <div className='h-3 w-16 bg-slate-100 rounded animate-pulse'></div>
                      </div>
                      <div className='h-4 w-full bg-slate-200 rounded animate-pulse'></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 하단 액션 영역 스켈레톤 */}
              <div className='px-6 py-3 bg-slate-50/20 border-t border-slate-100/50'>
                <div className='flex items-center justify-between'>
                  <div className='h-3 w-16 bg-slate-200 rounded animate-pulse'></div>
                  <div className='h-3 w-20 bg-slate-200 rounded animate-pulse'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}