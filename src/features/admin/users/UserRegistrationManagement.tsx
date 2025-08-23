'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EyeIcon, UserGroupIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  user_id: string;
  nickname: string;
  name: string;
  email: string;
  created_at: string;
  cohort: number;
  status: string;
  role: string;
}

export default function UserRegistrationManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

        if (error) {
          console.error('사용자 데이터 조회 오류:', error);
          return;
        }

        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('사용자 데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);

      if (error) {
        console.error('상태 업데이트 오류:', error);
        alert('상태 업데이트에 실패했습니다.');
        return;
      }

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)));

      alert('상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { text: '승인됨', color: 'bg-green-100 text-green-800 border-green-200' },
      pending: { text: '대기중', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      rejected: { text: '거부됨', color: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      text: '알 수 없음',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>{config.text}</span>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { text: '관리자', color: 'bg-purple-100 text-purple-800', icon: ShieldCheckIcon },
      student: { text: '수강생', color: 'bg-blue-100 text-blue-800', icon: AcademicCapIcon },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      text: '사용자',
      color: 'bg-gray-100 text-gray-800',
      icon: UserGroupIcon,
    };

    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.text}
      </span>
    );
  };

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'students') {
      if (user.role === 'student') {
        return true;
      }
      return false;
    }

    if (activeTab === 'admins') {
      if (user.role === 'admin') {
        return true;
      }
      return false;
    }

    // 혹시 탭 값이 잘못 들어왔을 때는 아무도 안 보여주기
    return false;
  });

  const openDetailModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedUser(null);
    setIsDetailModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl border border-slate-200 p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-slate-600'>사용자 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>사용자 관리</h1>
          <p className='text-slate-600 mt-1'>수강생과 관리자를 관리하고 승인할 수 있습니다</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
        <div className='border-b border-slate-200'>
          <nav className='-mb-px flex'>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <AcademicCapIcon className='w-4 h-4' />
                <span>수강생 관리</span>
                <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'>
                  {users.filter((u) => u.role === 'student' || !u.role).length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'admins'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <ShieldCheckIcon className='w-4 h-4' />
                <span>관리자 목록</span>
                <span className='bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs'>
                  {users.filter((u) => u.role === 'admin').length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* 사용자 목록 */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  사용자 정보
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  역할
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  기수
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  상태
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  가입일
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  작업
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-slate-200'>
              {filteredUsers.map((user) => (
                <tr key={user.id} className='hover:bg-slate-50'>
                  <td className='px-6 py-4'>
                    <div>
                      <div className='text-lg font-bold text-slate-900'>{user.nickname || '닉네임 없음'}</div>
                      <div className='text-sm text-slate-500 space-y-1'>
                        <div>{user.name || '실명 없음'}</div>
                        <div>@{user.user_id}</div>
                        <div>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>{getRoleBadge(user.role || 'student')}</td>
                  <td className='px-6 py-4 text-sm text-slate-900'>{user.cohort ? `${user.cohort}기` : '-'}</td>
                  <td className='px-6 py-4'>{getStatusBadge(user.status)}</td>
                  <td className='px-6 py-4 text-sm text-slate-500'>
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => openDetailModal(user)}
                        className='text-blue-600 hover:text-blue-900 text-sm'
                      >
                        <EyeIcon className='w-4 h-4' />
                      </button>

                      {activeTab === 'students' && user.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'approved')}
                          className='px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700'
                        >
                          승인
                        </button>
                      )}

                      {activeTab === 'students' && user.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'rejected')}
                          className='px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700'
                        >
                          거부
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {isDetailModalOpen && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between p-6 border-b border-slate-200'>
              <h3 className='text-lg font-semibold text-slate-900'>사용자 상세 정보</h3>
              <button onClick={closeDetailModal} className='text-slate-400 hover:text-slate-600'>
                <XMarkIcon className='w-6 h-6' />
              </button>
            </div>

            <div className='p-6 space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>닉네임</label>
                  <div className='text-lg font-bold text-slate-900'>{selectedUser.nickname || '없음'}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>실명</label>
                  <div className='text-sm text-slate-900'>{selectedUser.name || '없음'}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>아이디</label>
                  <div className='text-sm text-slate-900'>{selectedUser.user_id}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>이메일</label>
                  <div className='text-sm text-slate-900'>{selectedUser.email}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>역할</label>
                  <div>{getRoleBadge(selectedUser.role || 'student')}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>기수</label>
                  <div className='text-sm text-slate-900'>
                    {selectedUser.cohort ? `${selectedUser.cohort}기` : '미지정'}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>상태</label>
                  <div>{getStatusBadge(selectedUser.status)}</div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>가입일</label>
                  <div className='text-sm text-slate-900'>
                    {new Date(selectedUser.created_at).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>

              {selectedUser.role === 'student' && (
                <div className='pt-4 border-t border-slate-200'>
                  <div className='flex space-x-3'>
                    {selectedUser.status !== 'approved' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedUser.id, 'approved');
                          closeDetailModal();
                        }}
                        className='flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                      >
                        승인하기
                      </button>
                    )}

                    {selectedUser.status !== 'rejected' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedUser.id, 'rejected');
                          closeDetailModal();
                        }}
                        className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                      >
                        거부하기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
