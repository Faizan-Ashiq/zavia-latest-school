export type UserRole = 'principal' | 'teacher' | 'student';
export type Audience = 'all' | 'students' | 'teachers';

export interface Profile {
  id: string;
  full_name: string;
  roll_number?: string | null;
  class_name?: string | null;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: Audience;
  pinned: boolean;
  created_by?: string | null;
  created_at: string;
}

export interface DiaryHomework {
  id: string;
  class_name: string;
  subject: string;
  description: string;
  date: string;
  attachment_url?: string | null;
  created_by?: string | null;
  teacher_id?: string | null;
  teacher_name?: string | null;
  created_at?: string;
}

export interface PastPaper {
  id: string;
  title: string;
  class_name: string;
  file_url: string;
  uploaded_by_role?: string | null;
  created_at?: string;
}

export interface SchoolSettings {
  id?: string;
  youtube_url?: string | null;
  whatsapp_number?: string | null;
  contact_email?: string | null;
}
