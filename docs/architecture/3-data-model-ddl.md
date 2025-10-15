# **3\) Data Model (DDL)**

`-- Enums`  
`create type task_status as enum ('pending','in_progress','completed');`  
`create type task_priority as enum ('low','medium','high');`

`-- Optional profile view`  
`create table if not exists public.profiles (`  
  `id uuid primary key references auth.users(id) on delete cascade,`  
  `display_name text,`  
  `created_at timestamptz default now()`  
`);`

`create table if not exists public.categories (`  
  `id uuid primary key default gen_random_uuid(),`  
  `user_id uuid not null references auth.users(id) on delete cascade,`  
  `name text not null,`  
  `created_at timestamptz default now()`  
`);`

`create table if not exists public.tasks (`  
  `id uuid primary key default gen_random_uuid(),`  
  `user_id uuid not null references auth.users(id) on delete cascade,`  
  `title text not null,`  
  `description text,`  
  `status task_status not null default 'pending',`  
  `priority task_priority default 'medium',`  
  `due_date date,`  
  `category_id uuid references public.categories(id) on delete set null,`  
  `created_at timestamptz default now(),`  
  `updated_at timestamptz default now()`  
`);`

`create index if not exists idx_tasks_user_status_due on public.tasks(user_id, status, due_date, priority);`  
`create index if not exists idx_categories_user_name on public.categories(user_id, name);`

`-- RLS`  
`alter table public.profiles enable row level security;`  
`alter table public.categories enable row level security;`  
`alter table public.tasks enable row level security;`

`create policy "profiles_self"`  
  `on public.profiles for select`  
  `using (auth.uid() = id);`

`create policy "categories_self_all"`  
  `on public.categories for all`  
  `using (auth.uid() = user_id)`  
  `with check (auth.uid() = user_id);`

`create policy "tasks_self_all"`  
  `on public.tasks for all`  
  `using (auth.uid() = user_id)`  
  `with check (auth.uid() = user_id);`

---
