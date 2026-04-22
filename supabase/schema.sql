-- CodeFix Database Schema
-- Exported from Supabase

-- 1. Profiles Table
create table public.profiles (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  updated_at timestamp with time zone null default now(),
  phone text null,
  location text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- 2. Questions Table
create table public.questions (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  title text not null,
  content text not null,
  tags text[] null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  code_snippet text null,
  votes_count integer null default 0,
  constraint questions_pkey primary key (id),
  constraint fk_questions_profiles foreign KEY (user_id) references profiles (id) on delete CASCADE,
  constraint questions_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_questions_created_at on public.questions using btree (created_at desc) TABLESPACE pg_default;

-- 3. Answers Table
create table public.answers (
  id uuid not null default extensions.uuid_generate_v4 (),
  question_id uuid not null,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  code_snippet text null,
  constraint answers_pkey primary key (id),
  constraint answers_question_id_fkey foreign KEY (question_id) references questions (id),
  constraint answers_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_answers_question_id on public.answers using btree (question_id) TABLESPACE pg_default;

-- 4. Votes Table
create table public.votes (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  question_id uuid null,
  vote_type integer null,
  constraint votes_pkey primary key (id),
  constraint unique_user_question_vote unique (user_id, question_id),
  constraint votes_user_id_question_id_key unique (user_id, question_id),
  constraint votes_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE,
  constraint votes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint votes_vote_type_check check ((vote_type = any (array[1, '-1'::integer])))
) TABLESPACE pg_default;

-- 5. Chats Table
create table public.chats (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  title text null default 'New Conversation'::text,
  messages jsonb null default '[]'::jsonb,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint chats_pkey primary key (id),
  constraint chats_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- 6. Comments Table
create table public.comments (
  id uuid not null default extensions.uuid_generate_v4 (),
  answer_id uuid not null,
  user_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint comments_pkey primary key (id),
  constraint comments_answer_id_fkey foreign KEY (answer_id) references answers (id) on delete CASCADE,
  constraint comments_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_comments_answer_id on public.comments using btree (answer_id) TABLESPACE pg_default;


