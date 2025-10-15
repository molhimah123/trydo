# **8\) Performance**

* **Queries**: Filter by indexed columns; small page size; `select` only needed fields

* **Rendering**: Server Components where beneficial; suspense \+ streaming on slow paths

* **Realtime**: Subscribe only to current user channel; unsubscribe on unmount

* **Bundles**: Code-splitting, tree-shaking; avoid heavy UI libs

Targets (from PRD): LCP \< 2.5s, interactions perceived \< 200ms.

---
