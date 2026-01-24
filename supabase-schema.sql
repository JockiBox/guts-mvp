-- GUTS Game Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text not null unique,
  avatar_emoji text default '😎',
  avatar_color text default '#14b8a6',
  tokens integer default 100,
  vip_level integer default 0,
  created_at timestamptz default now(),
  last_login timestamptz default now(),
  daily_streak integer default 0,
  last_daily_claim timestamptz,
  total_tokens_purchased integer default 0,
  total_wins integer default 0,
  total_games integer default 0,
  unlocked_avatars text[] default array['😎', '🎮', '🃏', '🎰'],
  unlocked_themes text[] default array['default'],
  unlocked_effects text[] default array[]::text[]
);

-- Purchases table (tracks token purchases)
create table if not exists public.purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_session_id text not null,
  amount_cents integer not null,
  tokens_added integer not null,
  package_id text,
  created_at timestamptz default now()
);

-- Game sessions table (optional - for analytics)
create table if not exists public.game_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  rounds_played integer default 0,
  tokens_won integer default 0,
  tokens_lost integer default 0,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.game_sessions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Enable insert for authenticated users only"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Purchases policies
create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Game sessions policies
create policy "Users can view own game sessions"
  on public.game_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own game sessions"
  on public.game_sessions for insert
  with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for better performance
create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists game_sessions_user_id_idx on public.game_sessions(user_id);
