# FlashMaster - Smart Flashcard Learning App

## Problem Statement

Students and learners often need an efficient way to study and test their knowledge. FlashMaster solves this by providing an interactive flashcard application where users can create different types of study cards (Q&A, single-answer MCQ, and multiple-answer MCQ), organise them, and test themselves through a built-in review quiz mode with instant feedback and scoring.

## Technical Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (with Vite as build tool) |
| **Styling** | Vanilla CSS with CSS custom properties (design tokens) |
| **Routing** | React Router v6 (client-side SPA routing) |
| **State Management** | React Context API (AuthContext) |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt password hashing |
| **HTTP Client** | Axios |

## Features

- **Single-Page Application**: Entire app runs from one HTML file with React Router handling all navigation without page reloads
- **User Authentication**: Secure sign-up and sign-in with JWT tokens and hashed passwords
- **Three Flashcard Types**: Q&A (free-text answer), Single Correct Answer (radio selection), and Multiple Correct Answers (checkbox selection)
- **Dynamic Card Creation**: Add up to 6 answer options per MCQ card with add/remove functionality
- **Interactive Card Flip**: Click any flashcard to flip and reveal the answer with a smooth 3D animation
- **Quiz Review Mode**: Timed quiz flow showing one question at a time with progress tracking and score calculation
- **Review Summary**: After completing a quiz, view all questions with your answers vs. correct answers colour-coded
- **Full CRUD Operations**: Create, read, update, and delete flashcards stored in MongoDB
- **Responsive Design**: Mobile-friendly layout that adapts to all screen sizes
- **Input Validation**: Both client-side and server-side validation for all form inputs
- **Error Handling**: User-friendly error messages for API failures and invalid inputs

## Folder Structure

```
my-flashcards-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js      # Login/register logic
│   │   └── cardController.js      # CRUD operations for flashcards
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token verification
│   ├── models/
│   │   ├── flashcard.js           # Flashcard schema (question, answer, options, cardType)
│   │   └── user.js                # User schema (name, email, hashed password)
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   └── cardRoutes.js          # Flashcard CRUD endpoints
│   ├── server.js                  # Express server entry point
│   └── .env                       # Environment variables (DB URI, JWT secret)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForms.jsx      # Login and registration forms
│   │   │   ├── flashcard.jsx      # Individual flashcard with flip animation
│   │   │   ├── flashcardForm.jsx  # Card creation form with type selector
│   │   │   ├── flashcardList.jsx  # Grid display of all user flashcards
│   │   │   ├── LandingPage.jsx    # Homepage with hero section and features
│   │   │   ├── navbar.jsx         # Navigation bar with auth state
│   │   │   └── ReviewPage.jsx     # Quiz review mode with scoring
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global authentication state provider
│   │   ├── services/
│   │   │   └── api.js             # Axios API client for backend calls
│   │   ├── App.jsx                # Main app with routes and study page logic
│   │   ├── App.css                # Component-specific styles
│   │   ├── index.css              # Global styles and design system
│   │   └── main.jsx               # React app entry point
│   └── index.html                 # Single HTML file (SPA entry)
└── README.md
```

## CRUD Operations

| Operation | Description | API Endpoint |
|---|---|---|
| **Create** | Add a new flashcard (Q&A, single-answer, or multi-answer) | `POST /api/flashcards` |
| **Read** | Fetch all flashcards for the logged-in user | `GET /api/flashcards` |
| **Update** | Edit an existing flashcard's question, answers, or type | `PUT /api/flashcards/:id` |
| **Delete** | Remove a flashcard permanently | `DELETE /api/flashcards/:id` |

## How to Run

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Create a `.env` file in `/backend` with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Install frontend dependencies: `cd frontend && npm install`
5. Start the backend: `cd backend && node server.js`
6. Start the frontend: `cd frontend && npm run dev`
7. Open `http://localhost:5173` in your browser

## Challenges Overcome

Building the multiple-choice flashcard system required significant schema design work. The original flashcard model only stored a question and answer string, but extending it to support three card types (Q&A, single-answer MCQ, and multiple-answer MCQ) meant restructuring both the database schema and the frontend form to dynamically render different input configurations. The most complex part was handling the correct answer indices array, which had to stay synchronised when users added or removed options during editing. Additionally, implementing the quiz review mode required tracking user responses across all questions throughout a session, then presenting a comprehensive summary view that colour-codes each answer against the correct ones, which involved careful state management across multiple component renders.