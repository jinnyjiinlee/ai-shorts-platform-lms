import { supabase } from '@/lib/supabase/client';
import { WeeklyData, StudentSubmissionDetail } from '../types';

// 기수 목록 조회
export const getCohortList = async (): Promise<number[]> => {
  try {
    const { data, error } = await supabase.from('mission_notice').select('cohort').order('cohort', { ascending: true });

    if (error) throw error;
    const uniqueCohorts = [...new Set(data?.map((m) => m.cohort) || [])];
    return uniqueCohorts.length > 0 ? uniqueCohorts : [1];
  } catch (error) {
    console.error('기수 목록 조회 오류:', error);
    return [1];
  }
};

// 미션 목록 조회
const getMissions = async (cohort: number) => {
  const { data, error } = await supabase
    .from('mission_notice')
    .select('id, title, week, due_date')
    .eq('cohort', cohort)
    .order('week', { ascending: true });

  if (error) throw error;
  return data || [];
};

// 학생 목록 조회
const getStudents = async (cohort: number) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, nickname')
    .eq('cohort', cohort)
    .eq('role', 'student');

  if (error) throw error;
  return data || [];
};

// 모든 제출물 한번에 조회 (JOIN 사용으로 N+1 문제 해결)
const getAllSubmissions = async (cohort: number) => {
  const { data, error } = await supabase
    .from('mission_submit')
    .select(
      `
      id,
      mission_id,
      student_id,
      submitted_at,
      status,
      content,
      mission_notice!inner(cohort)
    `
    )
    .eq('mission_notice.cohort', cohort);

  if (error) throw error;
  return data || [];
};

// 중복 제출 제거 (같은 학생의 최신 제출만 유지)
interface SubmissionData {
  id: string,
  mission_id: string;
  student_id: string;
  submitted_at: string;
  status?: string;
  content?: string;
}

const removeDuplicateSubmissions = (submissions: SubmissionData[]) => {
  const submissionMap = new Map();

  submissions.forEach((sub) => {
    const key = `${sub.mission_id}-${sub.student_id}`;
    const existing = submissionMap.get(key);

    if (!existing || new Date(sub.submitted_at) > new Date(existing.submitted_at)) {
      submissionMap.set(key, sub);
    }
  });

  return Array.from(submissionMap.values());
};

// 제출 데이터를 Map 구조로 변환
interface SubmissionInfo {
  submitted: boolean;
  content: string;
  submittedAt: string;
  submissionId: string;
}

const buildSubmissionMap = (submissions: SubmissionData[]) => {
  const submissionMap = new Map<string, Map<string, SubmissionInfo>>();

  submissions.forEach((sub) => {
    if (!submissionMap.has(sub.mission_id)) {
      submissionMap.set(sub.mission_id, new Map());
    }

    submissionMap.get(sub.mission_id)!.set(sub.student_id, {
      submitted: true,
      content: sub.content || '',
      submittedAt: new Date(sub.submitted_at).toLocaleString('ko-KR'),
      submissionId: sub.id,
    });
  });

  return submissionMap;
};

// 미션별 통계 계산
interface MissionData {
  id: string;
  title: string;
  week: number;
  due_date: string;
}

const calculateMissionStats = (missions: MissionData[], submissions: SubmissionData[], studentCount: number) => {
  const submissionsByMission = new Map<string, number>();

  submissions.forEach((sub) => {
    submissionsByMission.set(sub.mission_id, (submissionsByMission.get(sub.mission_id) || 0) + 1);
  });

  return missions.map((mission) => {
    const submittedCount = submissionsByMission.get(mission.id) || 0;
    const submissionRate = studentCount > 0 ? Math.round((submittedCount / studentCount) * 100) : 0;

    return {
      week: mission.week,
      missionTitle: mission.title,
      missionId: mission.id,
      totalStudents: studentCount,
      submittedCount,
      submissionRate,
      dueDate: mission.due_date,
    };
  });
};

// 최적화된 통합 데이터 조회
export const getOptimizedMissionData = async (cohort: number) => {
  try {
    console.log('최적화된 미션 데이터 조회 시작...');

    // 병렬로 기본 데이터 조회
    const [missions, students, allSubmissions] = await Promise.all([
      getMissions(cohort),
      getStudents(cohort),
      getAllSubmissions(cohort),
    ]);

    // 중복 제거 및 데이터 가공
    const uniqueSubmissions = removeDuplicateSubmissions(allSubmissions);
    const submissionMap = buildSubmissionMap(uniqueSubmissions);
    const weeklyData = calculateMissionStats(missions, uniqueSubmissions, students.length);

    // 학생 상세 정보 생성
    const allStudents: StudentSubmissionDetail[] = students.map((student) => ({
      studentId: student.id,
      studentName: student.nickname || student.name || '알 수 없음',
      submissionStatus: 'not_submitted' as const,
    }));

    console.log(`조회 완료: 미션 ${missions.length}개, 학생 ${students.length}명`);

    return {
      weeklyData: weeklyData.sort((a, b) => a.week - b.week),
      studentSubmissions: submissionMap,
      allStudents,
    };
  } catch (error) {
    console.error('최적화된 미션 데이터 조회 오류:', error);
    throw error;
  }
};

// 학생별 미션 제출 상세 조회
export const getStudentSubmissions = async (missionId: string, cohort: number): Promise<StudentSubmissionDetail[]> => {
  try {
    const [students, submissions] = await Promise.all([
      getStudents(cohort),
      supabase
        .from('mission_submit')
        .select('id, mission_id, student_id, submitted_at, status, content')
        .eq('mission_id', missionId)
        .then(({ data, error }) => {
          if (error) throw error;
          return (data || []).map((sub) => ({ ...sub, mission_id: sub.mission_id || missionId }));
        }),
    ]);

    const uniqueSubmissions = removeDuplicateSubmissions(submissions);
    const submissionMap = new Map(uniqueSubmissions.map((sub) => [sub.student_id, sub]));

    return students.map((student) => {
      const submission = submissionMap.get(student.id);
      return {
        studentId: student.id,
        studentName: student.nickname || student.name || '알 수 없음',
        submissionStatus: submission ? 'submitted' : 'not_submitted',
        submittedAt: submission?.submitted_at ? new Date(submission.submitted_at).toLocaleString('ko-KR') : undefined,
        submissionContent: submission?.content || '',
      };
    });
  } catch (error) {
    console.error('학생 제출 상세 조회 오류:', error);
    throw error;
  }
};

// 하위 호환성을 위한 기존 함수들
export const fetchAvailableCohorts = getCohortList;
export const fetchMissionStudentDetails = getStudentSubmissions;

export const fetchMissionTrackingData = async (cohort: number): Promise<WeeklyData[]> => {
  const result = await getOptimizedMissionData(cohort);
  return result.weeklyData;
};
