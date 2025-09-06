import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminUserView } from '@/types/domains/user';
import { StatusCounts } from '../types/userManagement.types';
import { AdminUserService } from '../services/adminUserService';

// 🎯 사용자 관리 훅

export const useUserManagement = () => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedAllUser, setSelectedAllUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const usersPerPage = 10;

  // URL 파라미터 읽기
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const tabParam = searchParams.get('tab') as 'students' | 'admins';

    if (statusParam) {
      setStatusFilter(statusParam);
    }
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 사용자 데이터 로딩
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await AdminUserService.fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('사용자 데이터 가져오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 정렬 함수
  const getSortedUsers = useCallback(
    (usersToSort: AdminUserView[]) => {
      return [...usersToSort].sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';

        switch (sortBy) {
          case 'nickname':
            aValue = a.nickname || a.name || '';
            bValue = b.nickname || b.name || '';
            break;
          case 'role':
            aValue = a.role === 'admin' ? '1' : '2';
            bValue = b.role === 'admin' ? '1' : '2';
            break;
          case 'cohort':
            aValue = parseInt(a.cohort || '0');
            bValue = parseInt(b.cohort || '0');
            break;
          case 'status':
            const statusOrder = { approved: 1, pending: 2, rejected: 3 };
            aValue = statusOrder[a.status as keyof typeof statusOrder] || 4;
            bValue = statusOrder[b.status as keyof typeof statusOrder] || 4;
            break;
          case 'created_at':
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    },
    [sortBy, sortDirection]
  );

  // 정렬 핸들러
  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(column);
        setSortDirection('asc');
      }

      setTimeout(() => {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(1);
        }
      }, 0);
    },
    [sortBy, sortDirection, currentPage]
  );

  // 상태별 카운트 계산
  const statusCounts: StatusCounts = useMemo(() => {
    return users.reduce(
      (counts, user) => {
        let includeUser = false;
        if (activeTab === 'students') {
          includeUser = user.role === 'student' || !user.role;
        } else if (activeTab === 'admins') {
          includeUser = user.role === 'admin';
        }

        if (includeUser) {
          counts.all++;
          const status = user.status || 'unknown';
          counts[status as keyof StatusCounts] = (counts[status as keyof StatusCounts] || 0) + 1;
        }

        return counts;
      },
      { all: 0, approved: 0, pending: 0, rejected: 0, unknown: 0 }
    );
  }, [users, activeTab]);

  // 필터링 및 정렬
  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      let roleMatch = false;
      if (activeTab === 'students') {
        roleMatch = user.role === 'student' || !user.role;
      } else if (activeTab === 'admins') {
        roleMatch = user.role === 'admin';
      }

      let statusMatch = true;
      if (statusFilter !== 'all') {
        statusMatch = user.status === statusFilter;
      }

      return roleMatch && statusMatch;
    });

    return getSortedUsers(filtered);
  }, [users, activeTab, statusFilter, getSortedUsers]);

  // 페이지네이션
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 액션 핸들러들
  const handleStatusUpdate = useCallback(async (userId: string, newStatus: string) => {
    try {
      await AdminUserService.updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus as 'approved' | 'pending' | 'rejected' } : user
        )
      );
      alert('상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  }, []);

  // 관리자로 만들기 핸들러
  const handleRoleUpdate = useCallback(async (userId: string, newRole: string) => {
    try {
      await AdminUserService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole as 'admin' | 'student' } : user))
      );
      alert('역할이 업데이트되었습니다.');
    } catch (error) {
      console.error('역할 업데이트 오류:', error);
      alert('역할 업데이트에 실패했습니다.');
    }
  }, []);

  // 사용자 삭제 핸들러
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await AdminUserService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      alert('사용자가 삭제되었습니다.');
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      alert('사용자 삭제에 실패했습니다.');
    }
  }, []);

  const bulkApproval = useCallback(async () => {
    if (selectedUserIds.length === 0) return;

    try {
      const successCount = await AdminUserService.bulkUpdateStatus(selectedUserIds, 'approved');
      setUsers((prev) =>
        prev.map((user) => (selectedUserIds.includes(user.id) ? { ...user, status: 'approved' } : user))
      );
      setSelectedUserIds([]);
      setSelectedAllUser(false);
      alert(`${successCount}명의 사용자가 승인되었습니다.`);
    } catch (error) {
      console.error('일괄 승인 오류:', error);
      alert('일괄 승인 중 오류가 발생했습니다.');
    }
  }, [selectedUserIds]);

  const handleBulkRejection = useCallback(async () => {
    if (selectedUserIds.length === 0) return;

    try {
      const successCount = await AdminUserService.bulkUpdateStatus(selectedUserIds, 'rejected');
      setUsers((prev) =>
        prev.map((user) => (selectedUserIds.includes(user.id) ? { ...user, status: 'rejected' } : user))
      );
      setSelectedUserIds([]);
      setSelectedAllUser(false);
      alert(`${successCount}명의 사용자가 거부되었습니다.`);
    } catch (error) {
      console.error('일괄 거부 오류:', error);
      alert('일괄 거부 중 오류가 발생했습니다.');
    }
  }, [selectedUserIds]);

  // 선택 관리
  const handleSelectedAll = useCallback(() => {
    if (selectedAllUser) {
      setSelectedUserIds([]);
      setSelectedAllUser(false);
    } else {
      const currentPageUserIds = currentUsers.map((user) => user.id);
      setSelectedUserIds(currentPageUserIds);
      setSelectedAllUser(true);
    }
  }, [selectedAllUser, currentUsers]);

  const handleSelectedUser = useCallback(
    (userId: string) => {
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
    },
    [selectedUserIds, currentUsers.length]
  );

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedUserIds([]);
    setSelectedAllUser(false);
  }, []);

  return {
    // State
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
    filteredUsers,
    currentUsers,
    totalPages,
    indexOfFirstUser,
    indexOfLastUser,
    usersPerPage,

    // Actions
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
    fetchUsers,
    handleRoleUpdate,
    handleDeleteUser,
  };
};
