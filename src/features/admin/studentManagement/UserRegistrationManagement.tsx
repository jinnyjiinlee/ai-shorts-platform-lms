'use client';

import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useModal } from '@/features/shared/hooks/useModal';
import { AdminUserView } from '@/types/domains/user';
import { useUserManagement } from './hooks/useUserManagement';
import { UserFilters } from './components/UserFilters';
import { UserActions } from './components/UserActions';
import { UserTable } from './components/UserTable';
import { UserDetailModal } from './components/UserDetailModal';
import { UserPagination } from './components/UserPagination';

export default function UserRegistrationManagement() {
  const modal = useModal<AdminUserView>();
  const {
    users,
    isLoading,
    activeTab,
    statusFilter,
    selectedUserIds,
    selectedAllUser,
    currentPage,
    sortBy,
    sortDirection,
    statusCounts,
    currentUsers,
    totalPages,
    indexOfFirstUser,
    indexOfLastUser,
    setActiveTab,
    setStatusFilter,
    setCurrentPage,
    handleSort,
    handleStatusUpdate,
    bulkApproval,
    handleBulkRejection,
    handleSelectedAll,
    handleSelectedUser,
    handlePageChange,
    handleRoleUpdate,
    handleDeleteUser,
  } = useUserManagement();

  // 사용자 수 계산
  const studentCount = users.filter((u) => u.role === 'student' || !u.role).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'students' | 'admins') => {
    setActiveTab(tab);
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // 관리자로 만들기 핸들러
  const handleMakeAdmin = async (user: AdminUserView) => {
    if (confirm(`${user.nickname || user.name}님을 관리자로 만들겠습니까?`)) {
      try {
        // 여기서 실제 역할 변경 로직 호출
        console.log('관리자로 변경:', user);
        handleRoleUpdate(user.id, 'admin');
      } catch (error) {
        console.error('관리자 변경 실패:', error);
      }
    }
  };

  // 수강생으로 만들기 핸들러
  const handleMakeStudent = async (user: AdminUserView) => {
    if (confirm(`${user.nickname || user.name}님을 수강생으로 변경하겠습니까?`)) {
      try {
        handleRoleUpdate(user.id, 'student');
      } catch (error) {
        console.error('수강생 변경 실패:', error);
      }
    }
  };

  // 사용자 삭제 핸들러 (2단계 확인)
  const handleUserDelete = async (user: AdminUserView) => {
    // 1단계 확인
    if (!confirm(`${user.nickname || user.name}님의 계정을 삭제하시겠습니까?`)) return;
    
    // 2단계 확인 - 텍스트 입력
    const confirmText = prompt('정말로 삭제하시려면 "삭제합니다."을 입력해주세요:');
    if (confirmText !== '삭제합니다.') {
      alert('삭제가 취소되었습니다.');
      return;
    }
    
    try {
      await handleDeleteUser(user.id);
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
    }
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
        <div className='flex items-start space-x-4'>
          <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
            <UsersIcon className='w-6 h-6 text-blue-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>사용자 관리</h1>
            <p className='text-slate-600 mt-1'>수강생과 관리자를 관리하고 승인할 수 있습니다</p>
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <UserFilters
        activeTab={activeTab}
        statusFilter={statusFilter}
        statusCounts={statusCounts}
        studentCount={studentCount}
        adminCount={adminCount}
        onTabChange={handleTabChange}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* 테이블과 페이지네이션을 포함하는 컨테이너 */}
      <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
        {/* 일괄 작업 버튼 */}
        <UserActions
          activeTab={activeTab}
          selectedCount={selectedUserIds.length}
          onBulkApproval={bulkApproval}
          onBulkRejection={handleBulkRejection}
        />

        {/* 사용자 테이블 */}
        <UserTable
          users={currentUsers}
          activeTab={activeTab}
          selectedUserIds={selectedUserIds}
          selectedAllUser={selectedAllUser}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectAll={handleSelectedAll}
          onSelectUser={handleSelectedUser}
          onStatusUpdate={handleStatusUpdate}
          onMakeAdmin={handleMakeAdmin}
          onMakeStudent={handleMakeStudent}
          onDeleteUser={handleUserDelete}
        />

        {/* 페이지네이션 */}
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={currentUsers.length}
          indexOfFirstUser={indexOfFirstUser}
          indexOfLastUser={indexOfLastUser}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 상세 정보 모달 */}
      <UserDetailModal
        user={modal.viewItem}
        isOpen={!!modal.viewItem}
        onClose={modal.closeView}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
