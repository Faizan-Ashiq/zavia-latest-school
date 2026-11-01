-- ====================================================================
-- Zavia School System - Complete Supabase Database Migration
-- ====================================================================

-- 1. Enums / Custom Types
do $$ begin
  create type user_role as enum ('principal', 'teacher', 'student');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type audience as enum ('all', 'students', 'teachers');
exception
  when duplicate_object then null;
end $$;

-- 2. Tables & Primary Relational Schema
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  roll_number text,
  class_name text,
  email text,
  role user_role not null default 'student',
  created_at timestamptz default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target_audience audience not null default 'all',
  pinned boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists diary_homework (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  subject text not null,
  description text not null,
  date date not null default current_date,
  attachment_url text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists past_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_name text not null,
  file_url text not null,
  uploaded_by_role text,
  created_at timestamptz default now()
);

create table if not exists school_settings (
  id uuid primary key default gen_random_uuid(),
  youtube_url text,
  whatsapp_number text,
  contact_email text
);

-- Seed initial contact & channel settings for Zavia School System
insert into school_settings (youtube_url, whatsapp_number, contact_email)
select 'https://youtube.com/', '+92 301 4717700', 'zaviaschool2015@gmail.com'
where not exists (select 1 from school_settings);

-- 3. Security Definer Helper Functions (Avoids RLS recursion)
create or replace function my_role() returns user_role language sql stable security definer set search_path=public
as $$ select role from profiles where id = auth.uid() $$;

create or replace function my_class() returns text language sql stable security definer set search_path=public
as $$ select class_name from profiles where id = auth.uid() $$;

-- 4. Auth Sign-Up Role & Profile Synchronization Trigger
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare
  user_role user_role := 'student';
begin
  if (new.raw_user_meta_data->>'role') in ('teacher', 'student') then
    user_role := (new.raw_user_meta_data->>'role')::user_role;
  end if;

  insert into profiles (id, full_name, roll_number, class_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    case when user_role = 'teacher' then null else new.raw_user_meta_data->>'roll_number' end,
    case when user_role = 'teacher' then coalesce(new.raw_user_meta_data->>'subject', null) else new.raw_user_meta_data->>'class_name' end,
    new.email,
    user_role
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    class_name = excluded.class_name,
    roll_number = excluded.roll_number;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- 5. Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table announcements enable row level security;
alter table diary_homework enable row level security;
alter table past_papers enable row level security;
alter table school_settings enable row level security;

-- Profiles Policies
drop policy if exists "profiles read" on profiles;
create policy "profiles read" on profiles for select using (id = auth.uid() or my_role() = 'principal');

drop policy if exists "profiles principal write" on profiles;
create policy "profiles principal write" on profiles for all using (my_role() = 'principal') with check (my_role() = 'principal');

-- Announcements Policies
drop policy if exists "ann read" on announcements;
create policy "ann read" on announcements for select to authenticated using (
  my_role() = 'principal' or target_audience = 'all'
  or (target_audience = 'students' and my_role() = 'student')
  or (target_audience = 'teachers' and my_role() = 'teacher')
);

drop policy if exists "ann principal write" on announcements;
create policy "ann principal write" on announcements for all using (my_role() = 'principal') with check (my_role() = 'principal');

-- Diary Homework Policies
drop policy if exists "diary read" on diary_homework;
create policy "diary read" on diary_homework for select to authenticated using (
  my_role() in ('principal','teacher') or class_name = my_class()
);

drop policy if exists "diary insert" on diary_homework;
create policy "diary insert" on diary_homework for insert to authenticated with check (my_role() in ('principal','teacher'));

drop policy if exists "diary delete" on diary_homework;
create policy "diary delete" on diary_homework for delete to authenticated using (my_role() = 'principal' or created_by = auth.uid());

-- Past Papers Policies
drop policy if exists "papers read" on past_papers;
create policy "papers read" on past_papers for select to authenticated using (
  my_role() in ('principal','teacher') or class_name = my_class()
);

drop policy if exists "papers insert" on past_papers;
create policy "papers insert" on past_papers for insert to authenticated with check (my_role() in ('principal','teacher'));

drop policy if exists "papers delete" on past_papers;
create policy "papers delete" on past_papers for delete to authenticated using (my_role() = 'principal');

-- School Settings Policies
drop policy if exists "settings read" on school_settings;
create policy "settings read" on school_settings for select using (true);

drop policy if exists "settings update" on school_settings;
create policy "settings update" on school_settings for update using (my_role() = 'principal');

-- 6. Storage Buckets & Policies
insert into storage.buckets (id, name, public) values ('files','files',true) on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('school-assets','school-assets',true) on conflict (id) do update set public = true;

drop policy if exists "files public read" on storage.objects;
create policy "files public read" on storage.objects for select using (bucket_id in ('files', 'school-assets'));

drop policy if exists "files staff upload" on storage.objects;
create policy "files staff upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('files', 'school-assets') and my_role() in ('principal','teacher'));

drop policy if exists "files principal delete" on storage.objects;
create policy "files principal delete" on storage.objects for delete to authenticated
  using (bucket_id in ('files', 'school-assets') and my_role() = 'principal');

-- 7. Initial Admin / Staff User Setup Instructions:
-- In Supabase Dashboard > Authentication > Users > Add User (create principal account)
-- Then promote in SQL Editor:
--   update public.profiles set role = 'principal' where email = 'principal@zaviaschool.com';
