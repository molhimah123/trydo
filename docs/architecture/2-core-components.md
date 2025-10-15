# **2\) Core Components**

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
