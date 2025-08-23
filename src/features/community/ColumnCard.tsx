'use client';

import { useState } from 'react';
import { ChatBubbleLeftIcon, HeartIcon, ShareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
}

interface Column {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentCount: number;
  isLiked: boolean;
}

interface ColumnCardProps {
  column: Column;
  currentUser?: string;
}

export default function ColumnCard({ column, currentUser }: ColumnCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(column.isLiked);
  const [likeCount, setLikeCount] = useState(column.likes);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '김학생',
      content: '정말 유익한 칼럼이네요! 감사합니다.',
      createdAt: '2024-08-20 14:30',
      isOwner: false
    },
    {
      id: '2', 
      author: '이수강',
      content: '실제로 적용해보니 효과가 좋았습니다. 다음 칼럼도 기대됩니다!',
      createdAt: '2024-08-20 15:45',
      isOwner: false
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: newComment,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOwner: true
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent }
          : comment
      )
    );
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  const truncatedContent = column.content.length > 200 
    ? column.content.substring(0, 200) + '...'
    : column.content;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">하</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {column.author}
            </h3>
            <p className="text-sm text-slate-500">{column.createdAt}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
          <span className="text-xs font-medium text-purple-700">CEO 칼럼</span>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
        {column.title}
      </h2>

      {/* 내용 */}
      <div className="text-slate-700 mb-4 leading-relaxed">
        {isExpanded ? (
          <div className="whitespace-pre-line">{column.content}</div>
        ) : (
          <div className="whitespace-pre-line">{truncatedContent}</div>
        )}
        
        {column.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 transition-colors"
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-slate-500 hover:text-red-500'
            }`}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{comments.length}</span>
          </button>

          <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
            <ShareIcon className="w-5 h-5" />
            <span className="text-sm font-medium">공유</span>
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-slide-down">
          {/* 댓글 작성 */}
          {currentUser && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{currentUser[0]}</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group/comment">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{comment.author[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-xl p-3 group-hover/comment:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">{comment.createdAt}</span>
                        {comment.isOwner && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingComment(null)}
                            className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 whitespace-pre-line">{comment.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}