# **14\) Risks & Mitigations**

* **Realtime churn**: scope subscriptions per user; debounce updates

* **RLS misconfig**: add unit tests for policy coverage; verify with service-role checks

* **Cold starts / rate limits**: cache lists; keep payloads small; retry strategy with backoff

---
