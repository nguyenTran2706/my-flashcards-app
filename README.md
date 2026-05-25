# FlashMaster - Smart Flashcard Learning App

## Group Members

| Name             | Student ID |
| ---------------- | ---------- |
| Khoi Nguyen Tran | 25114442   |
| Truong An Vu     | 14508814   |

## Workload Allocation

Work was split so each member owns a full vertical slice of the stack. Individual contributions are also visible in the Git commit history — each member authored their own files.

**Khoi Nguyen Tran (25114442) — Backend**

- `backend/config/db.js`, `backend/server.js`
- `backend/models/` — `user.js`, `flashcard.js`, `viewHistory.js`
- `backend/controllers/` — `authController.js`, `cardController.js`, `historyController.js`, `adminController.js`
- `backend/routes/` — `authRoutes.js`, `cardRoutes.js`, `historyRoutes.js`, `adminRoutes.js`
- `backend/middleware/authMiddleware.js`
- `backend/scripts/` — `seedFlashcards.js`, `setAdmin.js`, `exportDb.js`

**Truong An Vu (14508814) — Frontend**

- `frontend/src/components/` — all React components (auth, flashcards, review, history, admin)
- `frontend/src/context/AuthContext.jsx`, `frontend/src/hooks/useTransientMessage.js`
- `frontend/src/services/api.js`
- `frontend/src/App.jsx`, `frontend/src/main.jsx`
- `frontend/src/index.css`, `frontend/src/App.css`, `frontend/index.html`
- `README.md` and the database export

## Problem Statement

Students and learners often need an efficient way to study and test their knowledge. FlashMaster solves this by providing an interactive flashcard application where users can create different types of study cards (Q&A, single-answer MCQ, and multiple-answer MCQ), organise them into categories, and test themselves through a built-in review quiz mode with instant feedback and scoring. Every completed quiz is saved to a personal review history so learners can track their progress over time, and an admin role lets staff oversee all users and their learning activity.

## Assignment 2 Requirements

All three required features for Assignment 2 have been implemented:

| #   | Requirement                                                                          | Entity         | Status  |
| --- | ----------------------------------------------------------------------------------- | -------------- | ------- |
| 1   | **Registration/login** — user authentication using password hashing (bcrypt) and JWT | `user`         | ✅ Done |
| 2   | **Live search** — a search bar that filters the flashcards in real-time as you type   | `flashcard`    | ✅ Done |
| 3   | **User profile** — an admin can view all users' learning history                      | `view_history` | ✅ Done |

## Technical Stack

| Layer                | Technology                                             |
| -------------------- | ------------------------------------------------------ |
| **Frontend**         | React 18 (with Vite as build tool)                     |
| **Styling**          | Vanilla CSS with CSS custom properties (design tokens) |
| **Routing**          | React Router v6 (client-side SPA routing)              |
| **State Management** | React Context API (AuthContext)                        |
| **Backend**          | Node.js with Express.js                                |
| **Database**         | MongoDB with Mongoose ODM                              |
| **Authentication**   | JWT (JSON Web Tokens) with bcrypt password hashing     |
| **HTTP Client**      | Axios                                                  |

## Features

- **Single-Page Application**: Entire app runs from one HTML file with React Router handling all navigation without page reloads
- **User Authentication**: Secure sign-up and sign-in with JWT tokens and hashed passwords
- **Role-Based Access**: Two roles (`user` and `admin`); admin-only routes are gated on both the frontend and backend
- **Three Flashcard Types**: Q&A (free-text answer), Single Correct Answer (radio selection), and Multiple Correct Answers (checkbox selection)
- **Card Categories**: Tag each card with a category (e.g. Geography, History) to keep decks organised
- **Dynamic Card Creation**: Add up to 6 answer options per MCQ card with add/remove functionality
- **Interactive Card Flip**: Click any flashcard to flip and reveal the answer with a smooth 3D animation
- **Live Search**: Instantly filter your cards by question, answer, category, or option as you type
- **Quiz Review Mode**: Timed quiz flow showing one question at a time with progress tracking and score calculation
- **Review Summary**: After completing a quiz, view all questions with your answers vs. correct answers colour-coded
- **View History**: Every completed quiz is saved as a session (score, timestamps, per-question snapshots) and listed newest-first, with optional personal notes per session
- **Admin Dashboard**: Admins can list all users with aggregate stats (session count, average score), drill into any user's full history, and delete a user (cascading their flashcards and history)
- **Full CRUD Operations**: Create, read, update, and delete flashcards and history sessions stored in MongoDB
- **Responsive Design**: Mobile-friendly layout that adapts to all screen sizes
- **Input Validation**: Both client-side and server-side validation for all form inputs
- **Error Handling**: User-friendly error messages for API failures and invalid inputs

## Folder Structure

```
my-flashcards-app/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js        # Login/register/me logic
│   │   ├── cardController.js        # CRUD operations for flashcards
│   │   ├── historyController.js     # CRUD operations for review history
│   │   └── adminController.js       # User listing, per-user history, user deletion
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification (protect) + adminOnly guard
│   ├── models/
│   │   ├── flashcard.js             # Flashcard schema (question, answer, category, options, cardType)
│   │   ├── user.js                  # User schema (name, email, hashed password, role)
│   │   └── viewHistory.js           # Review-session schema with embedded answer snapshots
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication endpoints
│   │   ├── cardRoutes.js            # Flashcard CRUD endpoints
│   │   ├── historyRoutes.js         # Review-history endpoints
│   │   └── adminRoutes.js           # Admin-only endpoints
│   ├── scripts/
│   │   ├── seedFlashcards.js        # Seed 20 sample cards for a user (by email)
│   │   ├── setAdmin.js              # Promote an existing user to admin (by email)
│   │   └── exportDb.js              # Export all collections to /database-export
│   ├── server.js                    # Express server entry point
│   └── .env                         # Environment variables (DB URI, JWT secret) — not committed
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForms.jsx        # Login and registration forms
│   │   │   ├── Flashcard.jsx        # Individual flashcard with flip animation
│   │   │   ├── FlashcardForm.jsx    # Card creation form with type + category selector
│   │   │   ├── FlashcardList.jsx    # Grid display with live search box
│   │   │   ├── LandingPage.jsx      # Homepage with hero section and features
│   │   │   ├── Navbar.jsx           # Navigation bar with auth + role-aware links
│   │   │   ├── ReviewPage.jsx       # Quiz review mode with scoring + history save
│   │   │   ├── HistoryPage.jsx      # List of the user's past review sessions
│   │   │   ├── SessionCard.jsx      # Single history session (expandable, editable notes)
│   │   │   ├── AdminUsersPage.jsx   # Admin table of all users with stats
│   │   │   └── AdminUserDetailPage.jsx # Admin view of one user's full history
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication state provider
│   │   ├── hooks/
│   │   │   └── useTransientMessage.js  # Auto-clearing success/info banner hook
│   │   ├── services/
│   │   │   └── api.js               # Axios API client for backend calls
│   │   ├── App.jsx                  # Main app with routes and study page logic
│   │   ├── App.css                  # Component-specific styles
│   │   ├── index.css               # Global styles and design system
│   │   └── main.jsx                # React app entry point
│   ├── vite.config.js              # Vite build/dev configuration
│   └── index.html                  # Single HTML file (SPA entry)
├── database-export/                # MongoDB data export (JSON, one file per collection)
│   ├── users.json
│   ├── flashcards.json
│   └── viewhistories.json
└── README.md
```

## API Endpoints

### Authentication (`/api/users`)

| Method | Endpoint              | Description                          | Access  |
| ------ | --------------------- | ------------------------------------ | ------- |
| POST   | `/api/users/register` | Register a new user                  | Public  |
| POST   | `/api/users/login`    | Log in and receive a JWT             | Public  |
| GET    | `/api/users/me`       | Get the current user's profile       | Private |

### Flashcards (`/api/flashcards`)

| Operation  | Description                                               | API Endpoint                 |
| ---------- | --------------------------------------------------------- | ---------------------------- |
| **Create** | Add a new flashcard (Q&A, single-answer, or multi-answer) | `POST /api/flashcards`       |
| **Read**   | Fetch all flashcards for the logged-in user               | `GET /api/flashcards`        |
| **Update** | Edit an existing flashcard's question, answers, or type   | `PUT /api/flashcards/:id`    |
| **Delete** | Remove a flashcard permanently                            | `DELETE /api/flashcards/:id` |

### Review History (`/api/history`)

| Method | Endpoint                  | Description                                 | Access          |
| ------ | ------------------------- | ------------------------------------------- | --------------- |
| POST   | `/api/history`            | Save a completed review session             | Private         |
| GET    | `/api/history`            | List the current user's sessions            | Private         |
| GET    | `/api/history/:id`        | Read a single session                       | Owner or admin  |
| PUT    | `/api/history/:id/notes`  | Update the notes on a session               | Owner           |
| DELETE | `/api/history/:id`        | Delete one of the user's sessions           | Owner           |

### Admin (`/api/admin`)

| Method | Endpoint                        | Description                                            | Access |
| ------ | ------------------------------- | ----------------------------------------------------- | ------ |
| GET    | `/api/admin/users`              | List all users with session count and average score   | Admin  |
| GET    | `/api/admin/users/:id/history`  | Get one user's full review history                     | Admin  |
| DELETE | `/api/admin/users/:id`          | Delete a user and cascade their flashcards + history   | Admin  |

## How to Run

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Create a `.env` file in `/backend` with:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
4. Install frontend dependencies: `cd frontend && npm install`
5. Start the backend: `cd backend && npm start`
6. Start the frontend: `cd frontend && npm run dev`
7. Open `http://localhost:5173` in your browser

### Helper Scripts (optional)

Run these from the `backend/` folder after creating an account:

- **Seed sample cards** for a user: `node scripts/seedFlashcards.js <email>` (inserts 20 example flashcards)
- **Promote a user to admin**: `node scripts/setAdmin.js <email>`

## Database Export

A snapshot of the MongoDB database (`flashcardsDB`) is included in the [`database-export/`](database-export/) folder as JSON, with one file per collection:

| File                  | Collection      | Contents                                              |
| --------------------- | --------------- | ---------------------------------------------------- |
| `users.json`          | `users`         | User accounts (passwords are stored as bcrypt hashes) |
| `flashcards.json`     | `flashcards`    | All flashcards (Q&A and MCQ)                          |
| `viewhistories.json`  | `viewhistories` | Saved review-quiz sessions                            |

To regenerate the export from a live database, run from the `backend/` folder:

```
node scripts/exportDb.js
```

> Note: passwords appear only as one-way bcrypt hashes — no plain-text credentials are included in the export.

## Challenges Overcome

Building the multiple-choice flashcard system required significant schema design work. The original flashcard model only stored a question and answer string, but extending it to support three card types (Q&A, single-answer MCQ, and multiple-answer MCQ) meant restructuring both the database schema and the frontend form to dynamically render different input configurations. The most complex part was handling the correct answer indices array, which had to stay synchronised when users added or removed options during editing.

Adding the review-history feature introduced a data-durability problem: a saved session needs to remain readable even if the original flashcards are later edited or deleted. This was solved by embedding an answer *snapshot* (question text, the user's answer, and the correct answer) directly inside each history document rather than only referencing the live cards. The admin dashboard then had to summarise this data efficiently, so user statistics (session count and average score) are computed in a single MongoDB aggregation rather than one query per user. Finally, role-based access required guarding admin functionality in two places — an `adminOnly` middleware on the backend routes and an `AdminRoute` wrapper on the frontend — so the UI and the API stay consistent about who can do what.
