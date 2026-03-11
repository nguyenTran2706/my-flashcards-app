import express from 'express';
import { getCards, createCard, updateCard, deleteCard } from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Group the routes by their path and protect them
router.route('/')
    .get(protect, getCards)
    .post(protect, createCard);

router.route('/:id')
    .put(protect, updateCard)
    .delete(protect, deleteCard);

export default router;