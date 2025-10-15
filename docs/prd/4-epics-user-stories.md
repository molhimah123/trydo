# **4\. Epics & User Stories**

## **Epic 1 – User Accounts & Authentication**

**Goal:** Allow users to securely sign up, log in, and manage their sessions.

| ID | User Story | Acceptance Criteria |
| ----- | ----- | ----- |
| US-1.1 | As a user, I can register and log in using email/password | Supabase Auth handles signup/login |
| US-1.2 | As a user, I can log out and stay logged out | Session cleared securely |
| US-1.3 | As a user, I can reset my password | Reset email sent via Supabase |
| US-1.4 | As a user, I can only access my own tasks | RLS policies enforce user isolation |

---

## **Epic 2 – Task Management & Productivity**

**Goal:** Provide users with an intuitive, real-time system for creating and managing tasks.

| ID | User Story | Acceptance Criteria |
| ----- | ----- | ----- |
| US-2.1 | As a user, I can add a new task | Task appears instantly (optimistic UI) |
| US-2.2 | As a user, I can edit or delete a task | Changes update instantly via realtime |
| US-2.3 | As a user, I can mark tasks as complete | Status visibly changes to “Completed” |
| US-2.4 | As a user, I can filter tasks by status or priority | List updates immediately |
| US-2.5 | As a user, I can view a summary (completed vs pending) | Simple progress indicator visible |

---
