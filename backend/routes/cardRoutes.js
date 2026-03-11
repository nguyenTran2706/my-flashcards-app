import express from 'express';
import { getCards, createCard, updateCard, deleteCard } from '../controllers/cardController.js';

const router = express.Router();

// Group the routes by their path
router.route('/')
    .get(getCards)
    .post(createCard);

router.route('/:id')
    .put(updateCard)
    .delete(deleteCard);

export default router;