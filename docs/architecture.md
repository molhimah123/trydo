# **Architecture — Simple Todo Webapp (Supabase MVP)**

## **1\) System Context**

* **Client (Next.js 14, React, TS, Tailwind)**  
   Renders UI, handles auth session, calls Supabase (PostgREST/RPC), subscribes to Realtime.

* **Supabase**

  * **Auth** (email/password, JWT)

  * **Postgres** (tasks, categories)

  * **RLS Policies** (row isolation per user)

  * **PostgREST** (auto CRUD) \+ **RPC** (optional SQL functions)

  * **Realtime** (changes feed)

* **Hosting/Delivery**

  * Frontend on **Vercel** (CI/CD on main)

  * Supabase managed project (DB, Auth, Realtime, backups)

`flowchart LR`  
  `U[User (Browser)] -->|HTTPS| FE[Next.js Frontend (Vercel)]`  
  `FE -->|JWT (Auth)| SA[Supabase Auth]`  
  `FE -->|REST (PostgREST)| DB[(Supabase Postgres)]`  
  `FE -->|Realtime (WS)| RT[Supabase Realtime]`  
  `DB <--> RT`

---

## **2\) Core Components**

**Frontend**

* **App Shell**: AuthGuard, Layout, Route segments (App Router)

* **Screens**: Sign In/Up/Reset, Tasks List, Task Editor (modal/drawer), Settings

* **State**: React Query (or Supabase client \+ SWR), Optimistic updates for CRUD

* **UI**: Tailwind, accessible components, toasts, skeleton loaders

**Backend (Supabase)**

* **Tables**: `tasks`, `categories`, `profiles` (optional)

* **Types**: `task_status` (pending/in\_progress/completed), `task_priority` (low/medium/high)

* **Policies (RLS)**: per-row isolation by `user_id = auth.uid()`

* **Indexes**: `(user_id, status, due_date, priority)` for fast filters

* **Realtime**: channel filtered by `user_id`

---

## **3\) Data Model (DDL)**

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

## **4\) API Surface (PostgREST \+ optional RPC)**

* **Auth**: via Supabase JS client (email/password, session handling).

* **Tasks**

  * `GET /rest/v1/tasks?user_id=eq.<uid>&order=due_date.asc`

  * `POST /rest/v1/tasks` (JSON: `{ title, description?, priority?, due_date?, category_id? }`)

  * `PATCH /rest/v1/tasks?id=eq.<id>` (partial updates incl. `status`)

  * `DELETE /rest/v1/tasks?id=eq.<id>`

* **Categories**: analogous CRUD.

* **Realtime**: subscribe to `postgres_changes` for `public.tasks` filtered by `user_id`.

Optional RPC examples (if needed for analytics):  
 `create or replace function public.completed_counts() returns table(completed int, pending int) ...`  
 Then `GET /rest/v1/rpc/completed_counts`.

---

## **5\) Key Flows (Sequence)**

### **5.1 Sign-in**

`sequenceDiagram`  
  `participant U as User`  
  `participant FE as Frontend (Next.js)`  
  `participant SA as Supabase Auth`  
  `U->>FE: Submit email/password`  
  `FE->>SA: signInWithPassword`  
  `SA-->>FE: JWT Session (access_token, refresh_token)`  
  `FE-->>U: Redirect to /app (store session)`

### **5.2 Create task (Optimistic \+ Realtime)**

`sequenceDiagram`  
  `participant U as User`  
  `participant FE as Frontend`  
  `participant DB as Supabase (PostgREST/DB)`  
  `participant RT as Supabase Realtime`  
  `U->>FE: Add task (title,...)`  
  `FE->>FE: Optimistic add to list`  
  `FE->>DB: POST /tasks (w/ JWT)`  
  `DB-->>RT: Row INSERT broadcast`  
  `RT-->>FE: change event (insert)`  
  `FE->>FE: Reconcile optimistic vs server record`

### **5.3 Filter & summary**

`sequenceDiagram`  
  `participant FE as Frontend`  
  `participant DB as Supabase`  
  `FE->>DB: GET /tasks?status=eq.completed&order=due_date.asc`  
  `DB-->>FE: Rows (RLS filtered)`  
  `FE->>FE: Compute counts (completed vs pending)`

---

## **6\) Frontend Architecture**

* **Routing**: Next.js App Router (`/`, `/auth/*`, `/app`, `/settings`)

* **Auth boundary**: `Middleware` or layout guard redirects unauthenticated users

* **Data access**: Supabase JS client (browser) or server actions where needed

* **State**: Local component state \+ React Query (or SWR) for caching/invalidation

* **Optimistic UI**: Immediately reflect user actions; reconcile via Realtime/response

* **UI patterns**: Accessible inputs, focus rings, keyboard shortcuts (optional)

---

## **7\) Security**

* **RLS everywhere** (no table without RLS)

* **JWT** from Supabase; use `supabase.auth.onAuthStateChange` to react to session updates

* **HTTPS** enforced (Vercel \+ Supabase default)

* **Least privilege**: Never expose service role key to client

* **Validation**: Client-side input checks (title length, date sanity); DB constraints for critical fields

* **Rate limiting**: Lightweight UI throttling (search/filter), DB safe by RLS; (optional) edge rate-limit via Vercel middleware if needed

---

## **8\) Performance**

* **Queries**: Filter by indexed columns; small page size; `select` only needed fields

* **Rendering**: Server Components where beneficial; suspense \+ streaming on slow paths

* **Realtime**: Subscribe only to current user channel; unsubscribe on unmount

* **Bundles**: Code-splitting, tree-shaking; avoid heavy UI libs

Targets (from PRD): LCP \< 2.5s, interactions perceived \< 200ms.

---

## **9\) Observability & Errors**

* **Client**: Console error boundary \+ toast surfacing; structured logs (optional Sentry)

* **Server/DB**: Supabase Logs (SQL, Auth); alerts on errors & policy violations

* **Metrics**:

  * Auth success/failure rate

  * CRUD error rate

  * Realtime disconnects

  * Query latency (P95)

---

## **10\) CI/CD & Environments**

* **Repo**: GitHub/GitLab mono (frontend \+ infra SQL)

* **CI**:

  * Lint & typecheck

  * Build

  * Playwright/Cypress smoke tests (auth \+ CRUD)

* **CD**:

  * Vercel auto-deploy preview on PR

  * Protected main → production

* **Migrations**: SQL files versioned (`/supabase/migrations`), applied via Supabase CLI

---

## **11\) Configuration & Secrets**

**Environment variables (Vercel/Local):**

`NEXT_PUBLIC_SUPABASE_URL=...`  
`NEXT_PUBLIC_SUPABASE_ANON_KEY=...`  
`SUPABASE_SERVICE_ROLE_KEY=...   # server-only (never to client)`

**Feature flags (optional):**

`NEXT_PUBLIC_FEATURE_ANALYTICS=true`  
`NEXT_PUBLIC_FEATURE_CATEGORIES=false`

---

## **12\) Backup, Retention, DR**

* **Backups**: Supabase automated daily backups enabled

* **Retention**: 7–30 days (per project plan)

* **Recovery**: Restore to point-in-time or new project; run migrations forward if needed

---

## **13\) Accessibility & i18n**

* **A11y**: WCAG 2.1 AA (labels, focus traps, keyboard flows)

* **i18n**: English MVP; structure ready for Arabic (RTL) using next-intl or similar later

---

## **14\) Risks & Mitigations**

* **Realtime churn**: scope subscriptions per user; debounce updates

* **RLS misconfig**: add unit tests for policy coverage; verify with service-role checks

* **Cold starts / rate limits**: cache lists; keep payloads small; retry strategy with backoff

---

## **15\) Minimal Cut List (if needed)**

* De-scope Categories (keep Priority \+ Status only)

* Drop Analytics chart; keep numeric KPIs (Completed/Pending)

* Remove Magic Link; keep email/password only

