# **10\) CI/CD & Environments**

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
