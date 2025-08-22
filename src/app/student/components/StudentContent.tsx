'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for code splitting
const ProgressDashboard = dynamic(() => import('../../components/student/dashboard/ProgressDashboard'));
const StudentMissionManagement = dynamic(() => import('../../components/student/missions/StudentMissionManagement'));
const CommunityView = dynamic(() => import('../../components/community/CommunityView'));
const WeeklyLearningMaterials = dynamic(() => import('../../components/admin/resources/WeeklyLearningMaterials'));
const BoardStyleColumn = dynamic(() => import('../../components/columns/BoardStyleColumn'));
const BoardStyleAnnouncement = dynamic(() => import('../../components/announcements/BoardStyleAnnouncement'));

interface StudentContentProps {
  activeMenu: string;
}

export default function StudentContent({ activeMenu }: StudentContentProps) {
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <ProgressDashboard />;
      case 'missions':
        return <StudentMissionManagement />;
      case 'weekly-materials':
        return <WeeklyLearningMaterials userRole='student' />;
      case 'ai-tools':
        return <AIToolsContent />;
      case 'columns':
        return <BoardStyleColumn />;
      case 'announcements':
        return <BoardStyleAnnouncement />;
      default:
        return <ProgressDashboard />;
    }
  };

  return (
    <main className='flex-1 overflow-y-auto'>
      <div className='p-6'>{renderContent()}</div>
    </main>
  );
}

// AI Tools Content Component - Redesigned for trendy modern UI
function AIToolsContent() {
  const aiTools = [
    {
      title: 'SNS 프로필 사진 제작기',
      description: 'AI가 한눈에 시선을 사로잡는 프로필 사진을 만들어드립니다.',
      icon: '📸',
      emoji: '✨',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      bgGradient: 'from-purple-50 to-pink-50',
      link: 'https://chatgpt.com/g/g-68a86d778e508191b5088abfb9acfa7e-sns-peuropil-sajin-jejaggi',
      features: ['맞춤형 계정 스타일', '시선 끄는 디자인', '브랜드.개인 모두 활용'],
      color: 'purple',
    },
    {
      title: '핫 트렌드 콘텐츠 생성',
      description: '실시간 트렌드를 분석하여 바이럴 가능성이 높은 아이디어를 제안합니다.',
      icon: '💡',
      emoji: '🚀',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      bgGradient: 'from-blue-50 to-purple-50',
      link: '#',
      features: ['최신 트렌드 반영', '시선 끄는 아이디어', '다양한 플랫폼 적용'],
      color: 'blue',
      comingSoon: true,
    },
    {
      title: '핫 시즌 상품 추천',
      description: '트렌딩 키워드를 입력하시면 해당 키워드에 맞는 상품 링크를 찾아드립니다.',
      icon: '📊',
      emoji: '🎆',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      link: '#',
      features: ['시즌별 인기템 큐레이션', '소비자 관심도 높은 아이템', '쇼핑.마케팅 높은 활용도'],
      color: 'yellow',
      comingSoon: true,
    },
    {
      title: '쇼츠 대본 생성',
      description: '선택한 상품 링크에 맞는 쇼츠 대본을 생성해 드립니다.',
      icon: '🎬',
      emoji: '🎯',
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      bgGradient: 'from-green-50 to-teal-50',
      link: '#',
      features: ['후킹 도입부 제안', '짧고 임팩트 있는 전개', '플랫폼별 최적화 지원'],
      color: 'green',
      comingSoon: true,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 overflow-hidden'>
      {/* 동적 배경 효과 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <div className='relative space-y-8 p-6'>
        {/* Hero Section */}
        <div className='relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>

          <div className='absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-300'></div>
          <div className='absolute bottom-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700'></div>

          <div className='relative z-10 text-center max-w-4xl mx-auto'>
            <div className='flex items-center justify-center space-x-3 mb-6'>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <span className='text-3xl'>🤖</span>
              </div>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <span className='text-3xl'>✨</span>
              </div>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <span className='text-3xl'>🚀</span>
              </div>
            </div>

            <h1 className='text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent'>
              AI 콘텐츠 스튜디오
            </h1>
            <p className='text-xl md:text-2xl text-indigo-100 mb-6'>최첨단 AI 기술로 완벽한 콘텐츠를 만들어보세요 🎆</p>
            <div className='inline-flex items-center space-x-2 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 animate-pulse'>
              <span className='text-sm font-medium'>프로처럼 만들고, 바이럴을 만들어보세요!</span>
              <span className='text-lg'>🚀</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {aiTools.map((tool, index) => (
            <div key={`ai-tool-${tool.title}-${index}`} className='group relative'>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} rounded-3xl blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300`}
              ></div>
              <div className='relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden'>
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-10`}></div>
                <div className='absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl'></div>

                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <div
                      className={`relative w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className='text-2xl filter drop-shadow-sm'>{tool.icon}</span>
                      <div className='absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs animate-bounce'>
                        {tool.emoji}
                      </div>
                    </div>
                    {tool.comingSoon ? (
                      <div
                        className={`px-4 py-2 bg-gray-400 text-white text-sm font-semibold rounded-full flex items-center space-x-2 cursor-not-allowed opacity-70`}
                      >
                        <span>나중에 공개</span>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    ) : (
                      <a
                        href={tool.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`group/btn px-4 py-2 bg-gradient-to-r ${tool.gradient} text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
                      >
                        <span>시작하기</span>
                        <svg
                          className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                    )}
                  </div>

                  <h3 className='text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 group-hover:bg-clip-text transition-all duration-300'>
                    {tool.title}
                  </h3>
                  <p className='text-slate-600 text-sm mb-4 leading-relaxed'>{tool.description}</p>

                  <div className='space-y-2'>
                    {tool.features.map((feature, idx) => (
                      <div
                        key={`feature-${tool.title}-${idx}`}
                        className='flex items-center space-x-3 group/feature hover:scale-105 transition-transform duration-200'
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.gradient} shadow-sm group-hover/feature:w-3 group-hover/feature:h-3 transition-all duration-200`}
                        ></div>
                        <span className='text-xs text-slate-700 font-medium'>{feature}</span>
                        <div className='flex-1 border-b border-dotted border-slate-200 group-hover/feature:border-slate-300 transition-colors'></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className='relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 rounded-3xl p-8 border border-white/40 shadow-xl'>
          <div className='absolute inset-0 bg-gradient-to-br from-amber-500/5 to-pink-500/5'></div>
          <div className='absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse'></div>

          <div className='relative flex items-start space-x-6'>
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce'>
                <span className='text-3xl'>💡</span>
              </div>
            </div>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
                프로 팁 & 비법 전수 🎨
              </h3>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='p-4 bg-white/50 rounded-xl border border-amber-200/50 backdrop-blur-sm'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-lg'>✨</span>
                    <span className='font-semibold text-slate-800'>창의적 활용법</span>
                  </div>
                  <p className='text-sm text-slate-600'>
                    AI 도구로 생성된 콘텐츠를 기반으로 자신만의 스타일과 개성을 더해보세요!
                  </p>
                </div>
                <div className='p-4 bg-white/50 rounded-xl border border-orange-200/50 backdrop-blur-sm'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-lg'>🚀</span>
                    <span className='font-semibold text-slate-800'>효율적 워크플로우</span>
                  </div>
                  <p className='text-sm text-slate-600'>
                    모든 도구를 순차적으로 사용하여 완벽한 콘텐츠 제작 파이프라인을 구축하세요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
