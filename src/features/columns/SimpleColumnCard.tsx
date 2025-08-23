'use client';

import { Column } from './types';
import { CalendarIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface SimpleColumnCardProps {
  column: Column;
  onSelect: (column: Column) => void;
  onLike: (columnId: number) => void;
}

export default function SimpleColumnCard({ column, onSelect, onLike }: SimpleColumnCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      {column.thumbnail && (
        <div 
          className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 cursor-pointer"
          onClick={() => onSelect(column)}
        >
          <img 
            src={column.thumbnail} 
            alt={column.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs text-purple-600 font-medium">
            {column.category}
          </span>
        </div>
        
        <h3 
          className="text-lg font-semibold text-slate-800 mb-2 cursor-pointer hover:text-purple-600 transition-colors"
          onClick={() => onSelect(column)}
        >
          {column.title}
        </h3>
        
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {column.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {column.date}
            </span>
            <span className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              {column.readTime}분
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(column.id);
            }}
            className="flex items-center space-x-1 text-slate-500 hover:text-purple-600 transition-colors"
          >
            {column.isLiked ? (
              <HeartSolidIcon className="w-4 h-4 text-purple-600" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
            <span>{column.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}