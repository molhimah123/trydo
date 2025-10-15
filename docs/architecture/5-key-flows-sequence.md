# **5\) Key Flows (Sequence)**

## **5.1 Sign-in**

`sequenceDiagram`  
  `participant U as User`  
  `participant FE as Frontend (Next.js)`  
  `participant SA as Supabase Auth`  
  `U->>FE: Submit email/password`  
  `FE->>SA: signInWithPassword`  
  `SA-->>FE: JWT Session (access_token, refresh_token)`  
  `FE-->>U: Redirect to /app (store session)`

## **5.2 Create task (Optimistic \+ Realtime)**

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

## **5.3 Filter & summary**

`sequenceDiagram`  
  `participant FE as Frontend`  
  `participant DB as Supabase`  
  `FE->>DB: GET /tasks?status=eq.completed&order=due_date.asc`  
  `DB-->>FE: Rows (RLS filtered)`  
  `FE->>FE: Compute counts (completed vs pending)`

---
