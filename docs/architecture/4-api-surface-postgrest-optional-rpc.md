# **4\) API Surface (PostgREST \+ optional RPC)**

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
