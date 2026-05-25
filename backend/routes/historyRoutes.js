import express from 'express';
import {
    createHistory,
    getMyHistory,
    getHistoryById,
    updateHistoryNotes,
    deleteHistory,
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyHistory).post(protect, createHistory);

router.route('/:id').get(protect, getHistoryById).delete(protect, deleteHistory);

router.put('/:id/notes', protect, updateHistoryNotes);

export default router;
