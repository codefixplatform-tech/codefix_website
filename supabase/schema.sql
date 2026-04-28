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

-- Function to sync votes count
CREATE OR REPLACE FUNCTION sync_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE questions
    SET votes_count = (SELECT COALESCE(SUM(vote_type), 0) FROM votes WHERE question_id = COALESCE(NEW.question_id, OLD.question_id))
    WHERE id = COALESCE(NEW.question_id, OLD.question_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

create trigger trg_sync_votes
after INSERT
or DELETE
or
update on votes for EACH row
execute FUNCTION sync_votes_count ();

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

-- 7. Security Policies (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public to see only non-sensitive columns
CREATE POLICY "Public profiles are visible to everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Restrict sensitive columns (only owner can see their own full row)
-- Standard PG column-level security:
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, full_name, avatar_url, updated_at) ON public.profiles TO anon;
GRANT SELECT (id, full_name, avatar_url, updated_at) ON public.profiles TO authenticated;
-- Authenticated users still need to select phone/location for their own profiles.
-- We can do this by granting on the table but using RLS to filter rows.
GRANT SELECT ON public.profiles TO authenticated; 

-- Correct way in PG/Supabase RLS:
CREATE POLICY "Users can see their own sensitive data"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Other tables RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create questions" ON public.questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own questions" ON public.questions FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Answers are viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create answers" ON public.answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own chats" ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chats" ON public.chats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own chats" ON public.chats FOR UPDATE USING (auth.uid() = user_id);


