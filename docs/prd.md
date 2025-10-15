# **🧩 Product Requirements Document (PRD)**

## **Project: Simple Todo Webapp (Supabase MVP)**

**Author:** Marry (PM) | **Date:** Oct 2025 | **Version:** 1.3

---

## **1\. Overview**

A minimal, fast **Todo Webapp** for managing daily tasks.  
 Built with **Next.js 14 \+ Supabase** for a secure, real-time, and responsive experience.

---

## **2\. Objectives**

* Help users quickly create and manage personal tasks.

* Provide real-time updates and reliable cloud sync.

* Deliver a clean, mobile-friendly UI with minimal friction.

---

## **3\. Scope**

**In Scope:**

* Authentication (Supabase Auth)

* CRUD operations for tasks

* Basic filtering (by status and priority)

* Realtime sync

* Responsive UI

**Out of Scope:**

* Collaboration

* Offline mode

* Third-party integrations

---

## **4\. Epics & User Stories**

### **Epic 1 – User Accounts & Authentication**

**Goal:** Allow users to securely sign up, log in, and manage their sessions.

| ID | User Story | Acceptance Criteria |
| ----- | ----- | ----- |
| US-1.1 | As a user, I can register and log in using email/password | Supabase Auth handles signup/login |
| US-1.2 | As a user, I can log out and stay logged out | Session cleared securely |
| US-1.3 | As a user, I can reset my password | Reset email sent via Supabase |
| US-1.4 | As a user, I can only access my own tasks | RLS policies enforce user isolation |

---

### **Epic 2 – Task Management & Productivity**

**Goal:** Provide users with an intuitive, real-time system for creating and managing tasks.

| ID | User Story | Acceptance Criteria |
| ----- | ----- | ----- |
| US-2.1 | As a user, I can add a new task | Task appears instantly (optimistic UI) |
| US-2.2 | As a user, I can edit or delete a task | Changes update instantly via realtime |
| US-2.3 | As a user, I can mark tasks as complete | Status visibly changes to “Completed” |
| US-2.4 | As a user, I can filter tasks by status or priority | List updates immediately |
| US-2.5 | As a user, I can view a summary (completed vs pending) | Simple progress indicator visible |

---

## **5\. Functional Requirements (FRs)**

| ID | Requirement | Priority |
| ----- | ----- | ----- |
| FR-1 | Enable user authentication via Supabase Auth | High |
| FR-2 | Implement CRUD operations for tasks | High |
| FR-3 | Support fields: title, description, status, priority, due\_date | High |
| FR-4 | Apply RLS so each user sees only their own data | Critical |
| FR-5 | Implement real-time updates for task changes | Medium |
| FR-6 | Provide filters by status and priority | Medium |
| FR-7 | Show task completion summary | Medium |
| FR-8 | Deliver responsive, mobile-first UI | High |

---

## **6\. Non-Functional Requirements (NFRs)**

| ID | Category | Requirement |
| ----- | ----- | ----- |
| NFR-1 | **Performance** | App interactions under 200 ms perceived delay |
| NFR-2 | **Security** | RLS \+ JWT Auth enforced |
| NFR-3 | **Availability** | 99.5% uptime via Supabase |
| NFR-4 | **Scalability** | Handle 10k users without schema change |
| NFR-5 | **Usability** | \< 3 clicks to add/edit/delete a task |
| NFR-6 | **Accessibility** | Keyboard friendly, color contrast compliant |
| NFR-7 | **Maintainability** | Modular Next.js components, clean codebase |

---

## **7\. Technical Overview**

| Layer | Stack | Notes |
| ----- | ----- | ----- |
| Frontend | Next.js 14, React, Tailwind CSS | Modern, mobile-first design |
| Backend | Supabase (Postgres \+ Auth \+ RLS \+ Realtime) | Secure and scalable |
| Hosting | Vercel (frontend) \+ Supabase cloud | CI/CD integration |
| Storage | Supabase | No external dependencies |

