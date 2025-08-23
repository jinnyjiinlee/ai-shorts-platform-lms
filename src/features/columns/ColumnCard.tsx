import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Column } from './types';

interface ColumnCardProps {
  column: Column;
  onClick: () => void;
  onLike: () => void;
}

export default function ColumnCard({ column, onClick, onLike }: ColumnCardProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: column.title,
        text: column.summary,
        url: window.location.href
      });
    }
  };

  return (
    <article 
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{column.thumbnail || '📄'}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {column.title}
          </h2>
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {column.summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{column.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{column.readTime}분 읽기</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {column.category}
              </span>
              <div className="flex items-center space-x-1">
                {column.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {column.isLiked ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-sm font-medium">{column.likes}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ShareIcon className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}