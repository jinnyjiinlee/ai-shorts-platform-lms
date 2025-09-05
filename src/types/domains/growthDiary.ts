export interface GrowthDiary {
  id: string;
  student_id: string;
  title: string;
  content: string;
  cohort: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    nickname?: string;
  };
}

export interface CreateGrowthDiaryDto {
  title: string;
  content: string;
  cohort?: string;
}

export interface UpdateGrowthDiaryDto {
  title?: string;
  content?: string;
}
