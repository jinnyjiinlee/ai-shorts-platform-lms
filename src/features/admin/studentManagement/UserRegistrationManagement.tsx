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
  cohort: string;
  status: string;
  role: string;
}

export default function UserRegistrationManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedAllUser, setSelectedAllUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
      const { error } = await supabase.from('profiles').upsert({ id: userId, status: newStatus }).eq('id', userId);

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

  // 페이지네이션 로직
  const filteredUsers = users.filter((user) => {
    if (activeTab === 'students') {
      return user.role === 'student' || !user.role;
    }
    if (activeTab === 'admins') {
      return user.role === 'admin';
    }
    return false;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedUserIds([]);
    setSelectedAllUser(false);
  };

  // 전체 선택/해제 핸들러 (현재 페이지만)
  const handleSelectedAll = () => {
    if (selectedAllUser) {
      setSelectedUserIds([]);
      setSelectedAllUser(false);
    } else {
      const currentPageUserIds = currentUsers.map((user) => user.id);
      setSelectedUserIds(currentPageUserIds);
      setSelectedAllUser(true);
    }
  };

  // 개별 사용자 선택/해제 핸들러
  const handleSelectedUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      const newSelectedIds = selectedUserIds.filter((id) => id !== userId);
      setSelectedUserIds(newSelectedIds);
      setSelectedAllUser(false);
    } else {
      const newSelectedIds = [...selectedUserIds, userId];
      setSelectedUserIds(newSelectedIds);
      if (newSelectedIds.length === currentUsers.length) {
        setSelectedAllUser(true);
      }
    }
  };

  // 일괄 승인 핸들러
  const handleBulkApproval = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      let successCount = 0;

      for (const userId of selectedUserIds) {
        const { error } = await supabase.from('profiles').upsert({ id: userId, status: 'approved' }).eq('id', userId);

        if (!error) {
          successCount++;
          setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: 'approved' } : user)));
        } else {
          console.error(`사용자 ${userId} 승인 오류:`, error);
        }
      }

      setSelectedUserIds([]);
      setSelectedAllUser(false);
      alert(`${successCount}명의 사용자가 승인되었습니다.`);
    } catch (error) {
      console.error('일괄 승인 오류:', error);
      alert('일괄 승인 중 오류가 발생했습니다.');
    }
  };

  // 일괄 거부 핸들러
  const handleBulkRejection = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      let successCount = 0;

      for (const userId of selectedUserIds) {
        const { error } = await supabase.from('profiles').upsert({ id: userId, status: 'rejected' }).eq('id', userId);

        if (!error) {
          successCount++;
          setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: 'rejected' } : user)));
        } else {
          console.error(`사용자 ${userId} 거부 오류:`, error);
        }
      }

      setSelectedUserIds([]);
      setSelectedAllUser(false);
      alert(`${successCount}명의 사용자가 거부되었습니다.`);
    } catch (error) {
      console.error('일괄 거부 오류:', error);
      alert('일괄 거부 중 오류가 발생했습니다.');
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

    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>{config.text}</span>;
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
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.text}
      </span>
    );
  };

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
              onClick={() => {
                setActiveTab('students');
                setCurrentPage(1);
                setSelectedUserIds([]);
                setSelectedAllUser(false);
              }}
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
              onClick={() => {
                setActiveTab('admins');
                setCurrentPage(1);
                setSelectedUserIds([]);
                setSelectedAllUser(false);
              }}
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

        {/* 일괄 작업 버튼 영역 */}
        {activeTab === 'students' && selectedUserIds.length > 0 && (
          <div className='p-4 bg-blue-50 border-b border-blue-200'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-blue-800 font-medium'>{selectedUserIds.length}명이 선택됨</span>
              <div className='flex space-x-2'>
                <button
                  onClick={handleBulkApproval}
                  className='px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors'
                >
                  선택한 사용자 승인
                </button>
                <button
                  onClick={handleBulkRejection}
                  className='px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors'
                >
                  선택한 사용자 거부
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 사용자 목록 */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50'>
              <tr>
                {activeTab === 'students' && (
                  <th className='px-4 py-2 text-left'>
                    <input
                      type='checkbox'
                      checked={selectedAllUser}
                      onChange={handleSelectedAll}
                      className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
                    />
                  </th>
                )}
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  사용자 정보
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  역할
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  기수
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  상태
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  가입일
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                  작업
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-slate-200'>
              {currentUsers.map((user) => (
                <tr key={user.id} className='hover:bg-slate-50'>
                  {activeTab === 'students' && (
                    <td className='px-4 py-2'>
                      <input
                        type='checkbox'
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleSelectedUser(user.id)}
                        className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
                      />
                    </td>
                  )}
                  <td className='px-4 py-2'>
                    <div>
                      <div className='text-sm font-bold text-slate-900'>{user.nickname || '닉네임 없음'}</div>
                      <div className='text-xs text-slate-500 space-y-0'>
                        <div>{user.name || '실명 없음'}</div>
                        <div>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-2'>{getRoleBadge(user.role || 'student')}</td>
                  <td className='px-4 py-2 text-xs text-slate-900'>{user.cohort ? `${user.cohort}기` : '-'}</td>
                  <td className='px-4 py-2'>{getStatusBadge(user.status)}</td>
                  <td className='px-4 py-2 text-xs text-slate-500'>
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className='px-4 py-2'>
                    <div className='flex items-center space-x-1'>
                      <button
                        onClick={() => openDetailModal(user)}
                        className='text-blue-600 hover:text-blue-900 text-xs p-1'
                      >
                        <EyeIcon className='w-3 h-3' />
                      </button>

                      {activeTab === 'students' && user.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'approved')}
                          className='px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700'
                        >
                          승인
                        </button>
                      )}

                      {activeTab === 'students' && user.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'rejected')}
                          className='px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700'
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className='px-6 py-4 border-t border-slate-200 bg-white'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-slate-600'>
                총 {filteredUsers.length}명 중 {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)}
                명 표시
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  이전
                </button>

                <div className='flex space-x-1'>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm border rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        )}
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
