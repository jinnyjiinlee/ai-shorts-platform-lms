'use client';

import { useState } from 'react';
import { Modal } from '@/features/shared/ui/Modal';
import { Badge } from '@/features/shared/ui/Badge';
import { Button } from '@/features/shared/ui/Button';
import { Question } from '../types';

interface QuestionDetailModalProps {
  show: boolean;
  question: Question | null;
  userRole: 'admin' | 'student';
  onClose: () => void;
  onCreateAnswer?: (questionId: string, content: string) => Promise<void>;
  onEditQuestion?: (questionId: string, title: string, content: string) => Promise<void>;
}

export default function QuestionDetailModal({
  show,
  question,
  userRole,
  onClose,
  onCreateAnswer,
  onEditQuestion,
}: QuestionDetailModalProps) {
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
  });

  if (!question) return null;

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim() || !onCreateAnswer) return;

    try {
      setSubmitting(true);
      await onCreateAnswer(question.id, answerContent);
      setAnswerContent('');
      onClose();
    } catch (error) {
      console.error('답변 작성 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 수정 모드 처리 함수들
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.content.trim() || !onEditQuestion) return;

    try {
      setSubmitting(true);
      await onEditQuestion(question.id, editForm.title, editForm.content);
      setIsEditing(false);
      onClose(); // 수정 후 모달 닫기
    } catch (error) {
      console.error('질문 수정 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({ title: '', content: '' });
  };

  return (
    <Modal show={show} title='질문 상세보기' onClose={onClose} size='2xl'>
      <div className='space-y-6'>
        {/* 질문 정보 */}
        <div>
          {isEditing ? (
            // 편집 모드
            <form onSubmit={handleEditSubmit}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>제목</label>
                  <input
                    type='text'
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>내용</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px] resize-vertical'
                    required
                  />
                </div>
                <div className='flex justify-end space-x-3'>
                  <Button type='button' onClick={handleEditCancel} variant='outline' disabled={submitting}>
                    취소
                  </Button>
                  <Button type='submit' variant='primary' disabled={submitting} isLoading={submitting}>
                    {submitting ? '저장중...' : '저장'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // 읽기 모드
            <>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-semibold text-slate-900'>{question.title}</h3>
                <Badge variant={question.status === 'open' ? 'warning' : 'success'} size='sm'>
                  {question.status === 'open' ? '미답변' : '답변완료'}
                </Badge>
              </div>

              <div className='text-sm text-slate-600 mb-4'>
                작성자: {question.student_nickname || question.student_name || '작성자'} | 작성일:{' '}
                {new Date(question.created_at).toLocaleDateString()}
              </div>

              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-slate-800 whitespace-pre-wrap'>{question.content}</p>
              </div>
            </>
          )}
        </div>

        {/* 기존 답변 표시 */}
        {question.answer && (
          <div>
            <h4 className='text-md font-medium text-slate-900 mb-3'>관리자 답변</h4>
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-slate-800 whitespace-pre-wrap'>{question.answer.content}</p>
              <div className='text-sm text-slate-600 mt-2'>
                답변일: {new Date(question.answer.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* 관리자 답변 작성 폼 */}
        {userRole === 'admin' && !question.answer && (
          <form onSubmit={handleAnswerSubmit}>
            <h4 className='text-md font-medium text-slate-900 mb-3'>답변 작성</h4>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder='답변을 작성해주세요...'
              className='w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-vertical'
              required
            />
            <div className='flex justify-end space-x-3 mt-4'>
              <Button type='button' onClick={onClose} variant='outline' disabled={submitting}>
                취소
              </Button>
              <Button type='submit' variant='primary' disabled={submitting} isLoading={submitting}>
                {submitting ? '등록중...' : '답변 등록'}
              </Button>
            </div>
          </form>
        )}

        {/* 버튼 영역 - 편집 모드가 아닐 때만 표시 */}
        {!isEditing && (
          <div className='flex justify-between items-center pt-4 border-t border-slate-200'>
            <div>
              {/* 학생이고 본인 질문이면 수정 버튼 표시 */}
              {userRole === 'student' && onEditQuestion && (
                <Button
                  variant='outline'
                  onClick={() => {
                    setEditForm({ title: question.title, content: question.content });
                    setIsEditing(true);
                  }}
                >
                  수정
                </Button>
              )}
            </div>
            <div>
              <Button onClick={onClose} variant='primary'>
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
