# **6\) Frontend Architecture**

* **Routing**: Next.js App Router (`/`, `/auth/*`, `/app`, `/settings`)

* **Auth boundary**: `Middleware` or layout guard redirects unauthenticated users

* **Data access**: Supabase JS client (browser) or server actions where needed

* **State**: Local component state \+ React Query (or SWR) for caching/invalidation

* **Optimistic UI**: Immediately reflect user actions; reconcile via Realtime/response

* **UI patterns**: Accessible inputs, focus rings, keyboard shortcuts (optional)

---
