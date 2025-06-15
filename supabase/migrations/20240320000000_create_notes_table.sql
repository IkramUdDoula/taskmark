-- Create notes table
create table if not exists public.notes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  blocks jsonb,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  updated timestamp with time zone default timezone('utc'::text, now()) not null,
  tags text[] default '{}'::text[],
  content text,
  checklist jsonb default '[]'::jsonb
);

-- Enable Row Level Security
alter table public.notes enable row level security;

-- Create policy to allow users to only see their own notes
create policy "Users can only access their own notes"
  on public.notes
  for all
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_created_idx on public.notes(created);
create index if not exists notes_updated_idx on public.notes(updated);

-- Enable realtime for the notes table
alter publication supabase_realtime add table public.notes; 