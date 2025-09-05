export interface Announcement {
  id: string;
  admin_id: string;
  title: string;
  content: string;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    nickname?: string;
  };
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  is_published?: boolean;
  is_pinned?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  is_published?: boolean;
  is_pinned?: boolean;
}
