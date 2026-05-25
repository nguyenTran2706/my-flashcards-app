import express from 'express';
import { listUsers, getUserHistory, deleteUser } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, adminOnly, listUsers);
router.get('/users/:id/history', protect, adminOnly, getUserHistory);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
