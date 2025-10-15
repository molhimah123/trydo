# **1\) System Context**

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
