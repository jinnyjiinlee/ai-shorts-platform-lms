import {
  ChevronLeftIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Column } from './types';

interface ColumnDetailProps {
  column: Column;
  onBack: () => void;
  onLike: () => void;
}

export default function ColumnDetail({ column, onBack, onLike }: ColumnDetailProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: column.title,
        text: column.summary,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 뒤로가기 헤더 */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>목록으로</span>
          </button>
        </div>
      </div>

      {/* 칼럼 내용 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* 헤더 */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="text-5xl">{column.thumbnail || '📄'}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  {column.title}
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  {column.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">하</span>
                      </div>
                      <span className="font-medium">{column.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{column.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{column.readTime}분 읽기</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onLike}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {column.isLiked ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="font-medium">{column.likes}</span>
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ShareIcon className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리 및 태그 */}
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {column.category}
              </span>
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-slate-400" />
                <div className="flex items-center space-x-2">
                  {column.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ 
                __html: column.content
                  .replace(/\n/g, '<br>')
                  .replace(/#{3}\s(.*?)(<br>|$)/g, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
                  .replace(/#{2}\s(.*?)(<br>|$)/g, '<h2 class="text-2xl font-bold mt-10 mb-6">$1</h2>')
                  .replace(/#{1}\s(.*?)(<br>|$)/g, '<h1 class="text-3xl font-bold mt-12 mb-8">$1</h1>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/^- (.+)/gm, '<li class="ml-4">$1</li>')
                  .replace(/(<li.*?>.*?<\/li>)/g, '<ul class="list-disc ml-6 space-y-2 my-4">$1</ul>')
                  .replace(/^\d+\.\s(.+)/gm, '<li class="ml-4">$1</li>')
                  .replace(/✅\s(.+)/g, '<div class="flex items-center space-x-2 my-2"><span class="text-green-500">✅</span><span>$1</span></div>')
                  .replace(/✨\s(.+)/g, '<div class="flex items-center space-x-2 my-2"><span class="text-yellow-500">✨</span><span>$1</span></div>')
              }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}