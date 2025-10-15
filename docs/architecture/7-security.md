# **7\) Security**

* **RLS everywhere** (no table without RLS)

* **JWT** from Supabase; use `supabase.auth.onAuthStateChange` to react to session updates

* **HTTPS** enforced (Vercel \+ Supabase default)

* **Least privilege**: Never expose service role key to client

* **Validation**: Client-side input checks (title length, date sanity); DB constraints for critical fields

* **Rate limiting**: Lightweight UI throttling (search/filter), DB safe by RLS; (optional) edge rate-limit via Vercel middleware if needed

---
