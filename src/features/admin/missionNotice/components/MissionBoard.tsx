'use client';

import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { BoardItem } from '@/features/shared/board/components/UniversalBoard';
import { WeekBadge } from '@/features/shared/ui/Badge';
import { Mission } from '@/types/domains/mission';

interface MissionBoardProps {
  missions: Mission[];
  userRole: 'admin' | 'student';
  loading?: boolean;
  error?: string;
  onViewMission?: (mission: Mission) => void;
  onEditMission?: (mission: Mission) => void;
  onDeleteMission?: (id: string) => void;
}

export default function MissionBoard({
  missions,
  userRole,
  loading,
  error,
  onViewMission,
  onEditMission,
  onDeleteMission,
}: MissionBoardProps) {
  
  // Mission을 BoardItem으로 변환
  const boardItems: BoardItem[] = missions.map(mission => {
    return {
      id: mission.id,
      title: mission.title,
      content: mission.description || mission.content,
      author: mission.authorNickname || '관리자',
      createdAt: new Date(mission.created_at).toLocaleDateString('ko-KR'),
      isPinned: false, // 미션에는 고정 기능이 없으므로 false
      isPublished: true, // 모든 미션은 생성되면 바로 공개됨
    badges: [
      // 주차 배지만 표시
      <WeekBadge 
        key="week" 
        week={mission.week}
        size="md"
        variant="gradient"
        theme="indigo-purple"
        format="W"
      />,
    ].filter(Boolean)
    };
  });


  const extraActions = () => {
    // 상태 토글 기능 제거 - 모든 미션은 생성되면 바로 공개됨
    return [];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">미션을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">{error}</div>
      ) : boardItems.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <RocketLaunchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <div className="space-y-2">
            <p className="text-lg mb-2">🚀 학습 미션</p>
            <p className="text-sm text-slate-400 mt-4">아직 등록된 미션이 없습니다.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {boardItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {/* 주차 배지를 제목 왼편에 배치 */}
                    <div className="flex items-center space-x-2">
                      {item.badges?.map((badge, index) => (
                        <span key={index}>{badge}</span>
                      ))}
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => {
                        const mission = missions.find(m => m.id === item.id);
                        if (mission && onViewMission) onViewMission(mission);
                      }}
                    >
                      {item.title}
                    </h3>
                    
                    {/* 상태 배지들을 제목 오른편에 배치 */}
                    <div className="flex items-center space-x-1">
                      {/* 임시저장 배지 제거 - 모든 미션은 생성되면 바로 공개됨 */}
                    </div>
                  </div>
                  
                  {item.content && (
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.content}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{item.author}</span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {/* 기본 액션들 */}
                  {onViewMission && (
                    <button
                      onClick={() => {
                        const mission = missions.find(m => m.id === item.id);
                        if (mission) onViewMission(mission);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="보기"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                  
                  {/* 관리자 전용 액션들 */}
                  {userRole === 'admin' && (
                    <>
                      {onEditMission && (
                        <button
                          onClick={() => {
                            const mission = missions.find(m => m.id === item.id);
                            if (mission) onEditMission(mission);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Extra Actions */}
                      {extraActions().map((action, index) => (
                        <span key={index}>{action}</span>
                      ))}
                      
                      {onDeleteMission && (
                        <button
                          onClick={() => onDeleteMission(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}