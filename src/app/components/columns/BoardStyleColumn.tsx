'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '../../../lib/hooks/common/useDebounce';
import { MagnifyingGlassIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Column } from './types';
import { mockColumns } from '../../../__mocks__/columns.mock';
import ReactMarkdown from 'react-markdown';

export default function BoardStyleColumn() {
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns] = useState<Column[]>(mockColumns);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredColumns = useMemo(() => {
    if (!debouncedSearchTerm) return columns;
    
    return columns.filter(column => 
      column.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [columns, debouncedSearchTerm]);

  if (selectedColumn) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <button
            onClick={() => setSelectedColumn(null)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>목록으로</span>
          </button>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{selectedColumn.title}</h1>
          <div className="flex items-center space-x-3 text-sm text-slate-500 mb-6">
            <span>{selectedColumn.date}</span>
            <span>·</span>
            <span>{selectedColumn.author}</span>
            <span>·</span>
            <span>{selectedColumn.readTime}분 읽기</span>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{selectedColumn.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">하대표 칼럼</h1>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="칼럼 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 게시판 형식 목록 */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-slate-600">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-7">제목</div>
            <div className="col-span-2 text-center">작성자</div>
            <div className="col-span-2 text-center">날짜</div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {filteredColumns.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredColumns.map((column, index) => (
              <div
                key={column.id}
                onClick={() => setSelectedColumn(column)}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="col-span-1 text-center text-sm text-slate-600">
                  {filteredColumns.length - index}
                </div>
                <div className="col-span-7">
                  <span className="text-sm text-slate-800 hover:text-blue-600">
                    {column.title}
                  </span>
                </div>
                <div className="col-span-2 text-center text-sm text-slate-600">
                  {column.author}
                </div>
                <div className="col-span-2 text-center text-sm text-slate-600">
                  {column.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}