'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CalendarIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../../../editor/MarkdownEditor';

interface Column {
  id: number;
  title: string;
  content: string;
  cohort: number;
  createdAt: string;
  author: string;
  isPublished: boolean;
}

export default function GuidebookManagement() {
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: 1, 
      title: '유튜브 쇼츠 알고리즘 완전 정복', 
      content: '유튜브 쇼츠 알고리즘의 작동 원리와 활용법에 대해 상세히 설명합니다...', 
      cohort: 1,
      createdAt: '2024-08-20', 
      author: '하대표', 
      isPublished: true
    },
    { 
      id: 2, 
      title: '첫 영상에서 구독자 1000명 모으기', 
      content: '성공적인 첫 영상 제작을 위한 전략과 주의사항들을 정리해드립니다...', 
      cohort: 1,
      createdAt: '2024-08-18', 
      author: '하대표', 
      isPublished: false
    }
  ]);

  const [form, setForm] = useState({ title: '', content: '', cohort: 1, isPublished: true });
  const [showForm, setShowForm] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [viewingColumn, setViewingColumn] = useState<Column | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<number | 'all'>('all');

  const availableCohorts = [1, 2, 3];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newColumn: Column = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      author: '하대표',
    };
    
    if (editingColumn) {
      setColumns(columns.map(col => col.id === editingColumn.id ? { ...newColumn, id: editingColumn.id } : col));
      setEditingColumn(null);
    } else {
      setColumns([newColumn, ...columns]);
    }
    
    setForm({ title: '', content: '', cohort: 1, isPublished: true });
    setShowForm(false);
  };

  const handleEdit = (column: Column) => {
    setForm({ title: column.title, content: column.content, cohort: column.cohort, isPublished: column.isPublished });
    setEditingColumn(column);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 칼럼을 삭제하시겠습니까?')) {
      setColumns(columns.filter(col => col.id !== id));
    }
  };

  const togglePublished = (id: number) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, isPublished: !col.isPublished } : col
    ));
  };

  const getFilteredColumns = () => {
    if (selectedCohort === 'all') return columns;
    return columns.filter(col => col.cohort === selectedCohort);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <PencilIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">하대표 칼럼 관리</h1>
              <p className="text-slate-100 text-lg">전문가의 노하우와 인사이트를 공유하세요</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-slate-100 font-medium text-sm">기수</label>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="all" className="text-slate-800">전체 기수</option>
                {availableCohorts.map(cohort => (
                  <option key={cohort} value={cohort} className="text-slate-800">{cohort}기</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setEditingColumn(null);
                setForm({ title: '', content: '', cohort: 1, isPublished: true });
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>새 칼럼 작성</span>
            </button>
          </div>
        </div>
      </div>

      {/* 칼럼 목록 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {selectedCohort === 'all' ? '전체' : `${selectedCohort}기`} 칼럼 목록
          </h2>
        </div>
        
        {getFilteredColumns().length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <PencilIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">아직 작성된 칼럼이 없습니다.</p>
            <button
              onClick={() => {
                setEditingColumn(null);
                setForm({ title: '', content: '', cohort: 1, isPublished: true });
                setShowForm(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 번째 칼럼 작성하기
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {getFilteredColumns().map((column) => (
              <div key={column.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{column.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {column.cohort}기
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        column.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {column.isPublished ? '공개' : '비공개'}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-3 line-clamp-2">{column.content}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{column.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{column.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingColumn(column)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="상세보기"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleEdit(column)}
                      className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="수정"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => togglePublished(column.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        column.isPublished
                          ? 'text-gray-600 hover:bg-gray-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={column.isPublished ? '비공개로 변경' : '공개로 변경'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={column.isPublished ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"}
                        />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(column.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 작성/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingColumn ? '칼럼 수정' : '새 칼럼 작성'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">칼럼 제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="칼럼 제목을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">대상 기수</label>
                <select
                  value={form.cohort}
                  onChange={(e) => setForm({...form, cohort: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableCohorts.map(cohort => (
                    <option key={cohort} value={cohort}>{cohort}기</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">칼럼 내용</label>
                <MarkdownEditor
                  value={form.content}
                  onChange={(value) => setForm({...form, content: value})}
                  placeholder="마크다운으로 칼럼 내용을 작성하세요!"
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({...form, isPublished: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-slate-700">즉시 공개</label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingColumn(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingColumn ? '수정' : '작성'} 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
      {viewingColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{viewingColumn.title}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {viewingColumn.cohort}기
                    </span>
                    <span className="text-sm text-slate-600">{viewingColumn.author}</span>
                    <span className="text-sm text-slate-600">{viewingColumn.createdAt}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingColumn(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: viewingColumn.content }}
              />
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingColumn(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}