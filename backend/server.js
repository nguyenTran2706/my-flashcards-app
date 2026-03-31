import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';

import cardRoutes from './routes/cardRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file (won't error if missing, e.g. on Vercel)
dotenv.config({ path: join(__dirname, '.env') });

// Connect to MongoDB
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flashcards', cardRoutes);
app.use('/api/users', authRoutes);

const PORT = process.env.PORT || 5000;

// Only listen locally, Vercel will use the exported app
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;