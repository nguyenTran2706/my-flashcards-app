import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';

// ---> 1. ADD THIS IMPORT <---
import cardRoutes from './routes/cardRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ---> 2. ADD THIS LINE TO USE THE ROUTES <---
app.use('/api/flashcards', cardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});