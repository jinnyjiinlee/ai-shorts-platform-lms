import { useState, useEffect } from 'react';
import { Mission } from '@/features/student/dashboard/types';
import {
  fetchMissions,
  createMission,
  updateMission,
  deleteMission,
} from '../../services/missions/adminMissionService';

export const useMissionManagement = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMissions();
      setMissions(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : '미션 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveMission = async (modalType: 'create' | 'edit', formData: any, selectedMission?: Mission) => {
    try {
      if (modalType === 'create') {
        await createMission(formData);
      } else if (modalType === 'edit' && selectedMission) {
        await updateMission(selectedMission.id, formData);
      }
      await loadMissions();
    } catch (error) {
      alert(error instanceof Error ? error.message : '미션 저장 중 오류가 발생했습니다.');
    }
  };

  const removeMission = async (missionId: string) => {
    if (confirm('정말로 이 미션을 삭제하시겠습니까?')) {
      try {
        await deleteMission(missionId);
        await loadMissions();
      } catch (error) {
        alert(error instanceof Error ? error.message : '미션 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  return {
    missions,
    isLoading,
    saveMission,
    removeMission,
    refreshMissions: loadMissions, // 관리자도 새로고침 가능
  };
};
