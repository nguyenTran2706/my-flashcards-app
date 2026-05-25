# FlashMaster — Assignment 2 PRD

Product Requirements Document for extending Assignment 1 (FlashMaster) to meet Assignment 2's "Flashcard Learning App" requirements.

---

## 1. Background

Assignment 1 delivered FlashMaster: a React + Express + MongoDB SPA where authenticated users create three types of flashcards (Q&A, single-answer MCQ, multi-answer MCQ), study them with a card-flip UI, and take a self-scored quiz in Review mode. Two persisted entities exist today: `User` and `Flashcard`.

Assignment 2 requires a **third entity** (`view_history`), **live search**, and an **admin role** that can view all users' learning history. This document scopes the smallest set of changes needed to fully satisfy the rubric.

## 2. Goals

1. Satisfy rubric **"GROUP – Suitability and Comprehensiveness"** — CRUD on at least three conceptual entities (`User`, `Flashcard`, `ViewHistory`).
2. Satisfy rubric **"INDIVIDUAL – Workload and App Features"** — JWT-based auth (already in place) plus role-based access control (new).
3. Deliver the three Flashcard-track features from the brief:
    - Registration/login with hashed passwords + JWT (already done — verify and document).
    - Live search filtering the flashcard list as the user types (new).
    - Admin user-profile page listing all users' learning history (new).
4. Preserve SPA behaviour, the single `index.html`, and the existing seamless interaction model.

## 3. Non-Goals

- No redesign of the marketing landing page or visual identity.
- No spaced-repetition algorithm, deck sharing, or social features.
- No password reset flow, email verification, or OAuth.
- No migration of existing flashcards (the schema is additive only).

---

## 4. Entities (CRUD-Eligible)

### 4.1 `User` (existing — extend)

| Field        | Type                                               | Notes                        |
| ------------ | -------------------------------------------------- | ---------------------------- |
| `name`       | String                                             | existing                     |
| `email`      | String, unique                                     | existing                     |
| `password`   | String, hashed                                     | existing                     |
| **`role`**   | String, enum `['user', 'admin']`, default `'user'` | **new** — gates admin routes |
| `timestamps` | createdAt/updatedAt                                | existing                     |

- Admin accounts are minted manually (seed script or one-off DB update) — no self-service admin signup.
- Login response and `GET /api/users/me` must include `role` so the frontend can branch UI.

### 4.2 `Flashcard` (existing — no schema change)

Unchanged. Live search runs client-side over the user's own card list.

### 4.3 `ViewHistory` (new)

Captures every completed quiz session so admins have a per-user learning timeline.

| Field          | Type                                                                                                                                  | Notes                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `user`         | ObjectId → User, required, indexed                                                                                                    | who took the quiz                                                            |
| `startedAt`    | Date                                                                                                                                  | session start                                                                |
| `completedAt`  | Date                                                                                                                                  | session end                                                                  |
| `totalCards`   | Number                                                                                                                                | quiz length                                                                  |
| `correctCount` | Number                                                                                                                                | score numerator                                                              |
| `scorePercent` | Number                                                                                                                                | `correctCount / totalCards * 100`, rounded                                   |
| `answers`      | Array of `{ flashcard: ObjectId, question: String, userAnswer: String, correctAnswer: String, isCorrect: Boolean, cardType: String }` | per-question snapshot — embed strings so history survives flashcard deletion |
| `timestamps`   | createdAt/updatedAt                                                                                                                   |                                                                              |

- We embed question/answer strings rather than only ref'ing flashcards so deleting a card doesn't blank past history.

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization (incremental)

- **FR-1** `User.role` added; defaults to `'user'`.
- **FR-2** Login + `/me` responses include `role`.
- **FR-3** New middleware `adminOnly` runs after `protect` and returns `403` if `req.user.role !== 'admin'`.
- **FR-4** Frontend `AuthContext` exposes `user.role`; `Navbar` conditionally shows an **Admin** link.
- **FR-5** Frontend `/admin/*` routes redirect non-admins to `/`.

### 5.2 Live Search (new)

- **FR-6** A search input sits above the flashcard grid on `/study`.
- **FR-7** Filter is client-side, case-insensitive, debounced ~150 ms, and matches against `question`, `answer`, `category`, and `options[]`.
- **FR-8** Empty matches show a friendly empty state ("No cards match '<query>'"); clearing the input restores the full list with no re-fetch.
- **FR-9** Card count badge reflects filtered count (e.g. `3 of 12 cards`).

### 5.3 View History (new)

- **FR-10** When a user finishes a quiz on `/review`, the frontend `POST /api/history` with the session payload. Failure is non-fatal (toast + retry; do not block the results screen).
- **FR-11** Users can see **their own** history at `/history` — list of past sessions newest-first with date, score, and a "View answers" expand.
- **FR-12** Endpoints:
    - `POST /api/history` — create session (user-scoped, owner = `req.user.id`).
    - `GET /api/history` — list current user's sessions.
    - `GET /api/history/:id` — read one session (owner or admin).
    - `DELETE /api/history/:id` — delete one of the user's own sessions.
    - `PUT /api/history/:id/notes` — update an optional `notes` string (rounds out the CRUD requirement on this entity).

### 5.4 Admin User-Profile Page (new)

- **FR-13** `/admin/users` lists all users with name, email, role, signup date, total sessions, average score.
- **FR-14** Clicking a row opens `/admin/users/:id` with that user's full `ViewHistory` list (same expand-to-see-answers UI as `/history`).
- **FR-15** Admin endpoints (all behind `protect + adminOnly`):
    - `GET /api/admin/users` — list all users (password excluded).
    - `GET /api/admin/users/:id/history` — list one user's sessions.
    - `DELETE /api/admin/users/:id` — remove a user (cascades: their flashcards + history). Confirm dialog required.
- **FR-16** Admins must not see any flashcard content beyond what appears in `ViewHistory.answers` — the brief only requires visibility of learning history, not other users' card decks.

### 5.5 SPA & UX

- **FR-17** All new screens render under the existing `BrowserRouter` setup — no new HTML files.
- **FR-18** API errors render a non-blocking error banner (existing pattern); never a blank page.
- **FR-19** All new forms validate client-side and server-side.

---

## 6. Non-Functional Requirements

- **NFR-1** Search and route transitions must feel instant (<100 ms perceived) on a list of ≤500 cards.
- **NFR-2** Backwards-compatible schema changes only (defaults for new fields so existing docs keep working).
- **NFR-3** No secrets in code. `.env` continues to hold `MONGO_URI` and `JWT_SECRET`; admin seed credentials are env-only.
- **NFR-4** Code style follows the existing conventions in the repo (ESM imports, named exports for controllers, route-grouped Express files).

---

## 7. API Surface (summary)

| Method       | Path                           | Auth          | Notes                        |
| ------------ | ------------------------------ | ------------- | ---------------------------- |
| POST         | `/api/users/register`          | public        | unchanged                    |
| POST         | `/api/users/login`             | public        | response now includes `role` |
| GET          | `/api/users/me`                | user          | response now includes `role` |
| GET / POST   | `/api/flashcards`              | user          | unchanged                    |
| PUT / DELETE | `/api/flashcards/:id`          | user          | unchanged                    |
| POST         | `/api/history`                 | user          | new                          |
| GET          | `/api/history`                 | user          | new — own sessions           |
| GET          | `/api/history/:id`             | user or admin | new                          |
| PUT          | `/api/history/:id/notes`       | user (owner)  | new                          |
| DELETE       | `/api/history/:id`             | user (owner)  | new                          |
| GET          | `/api/admin/users`             | admin         | new                          |
| GET          | `/api/admin/users/:id/history` | admin         | new                          |
| DELETE       | `/api/admin/users/:id`         | admin         | new                          |

---

## 8. Frontend Routes

| Path               | Access | Purpose                                                     |
| ------------------ | ------ | ----------------------------------------------------------- |
| `/`                | public | landing (existing)                                          |
| `/auth`            | public | login/register (existing)                                   |
| `/study`           | user   | flashcard CRUD + live search (extended)                     |
| `/review`          | user   | quiz flow; posts to `/api/history` on completion (extended) |
| `/history`         | user   | own learning history (new)                                  |
| `/admin/users`     | admin  | list of all users (new)                                     |
| `/admin/users/:id` | admin  | one user's full learning history (new)                      |

---

## 9. Rubric Mapping

| Rubric criterion                | How this PRD addresses it                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Suitability — 3+ CRUD entities  | `User`, `Flashcard`, `ViewHistory` all support full CRUD                                                       |
| Business / design / performance | Live search ≤150 ms debounce; admin views paginated if list grows                                              |
| Workload & app features         | JWT (existing) + RBAC (new `adminOnly` middleware)                                                             |
| Code quality                    | Reuse existing controller/route patterns; shared `HistoryCard` component for `/history` and `/admin/users/:id` |
| Professional practices          | Discrete commits per FR group, no hardcoded credentials                                                        |

---

## 10. Open Questions

1. Do we want a public "leaderboard" view for users, or is history strictly private/admin-visible? (Spec only mandates admin visibility — default to private + admin.)
2. Should admins be able to _edit_ another user's role (promote/demote), or only delete? (Default: delete only; promotion is DB-side.)
3. Should the search bar also live on `/review` or only on `/study`? (Default: `/study` only — review is a linear quiz.)
4. Cascade behaviour on user delete: delete their flashcards and history, or anonymise? (Default: hard delete, simpler and matches "delete a user" intent.)

---

## 11. Out of Scope for This Submission

- Pagination on admin lists (we'll cap to most recent 100 if needed; full pagination is a stretch).
- CSV/JSON export of history.
- Per-deck or per-category analytics charts.
