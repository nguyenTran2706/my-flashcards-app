import ViewHistory from '../models/viewHistory.js';

// @desc    Create a new view-history session for the current user
// @route   POST /api/history
// @access  Private (user)
export const createHistory = async (req, res) => {
    try {
        const { startedAt, completedAt, totalCards, correctCount, answers } = req.body;

        if (typeof totalCards !== 'number' || typeof correctCount !== 'number') {
            return res.status(400).json({ message: 'totalCards and correctCount are required' });
        }

        const scorePercent =
            totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

        const session = await ViewHistory.create({
            user: req.user.id,
            startedAt: startedAt || Date.now(),
            completedAt: completedAt || Date.now(),
            totalCards,
            correctCount,
            scorePercent,
            answers: answers || [],
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: 'Failed to save history', error: error.message });
    }
};

// @desc    List the current user's history sessions, newest first
// @route   GET /api/history
// @access  Private (user)
export const getMyHistory = async (req, res) => {
    try {
        const sessions = await ViewHistory.find({ user: req.user.id }).sort({ completedAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
};

// @desc    Read a single session (owner or admin)
// @route   GET /api/history/:id
// @access  Private (owner or admin)
export const getHistoryById = async (req, res) => {
    try {
        const session = await ViewHistory.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'History session not found' });

        const isOwner = session.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this session' });
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch session', error: error.message });
    }
};

// @desc    Update the optional notes on one of the user's sessions
// @route   PUT /api/history/:id/notes
// @access  Private (owner only)
export const updateHistoryNotes = async (req, res) => {
    try {
        const session = await ViewHistory.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'History session not found' });
        if (session.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        session.notes = req.body.notes || '';
        await session.save();
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update notes', error: error.message });
    }
};

// @desc    Delete one of the user's own sessions
// @route   DELETE /api/history/:id
// @access  Private (owner only)
export const deleteHistory = async (req, res) => {
    try {
        const session = await ViewHistory.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'History session not found' });
        if (session.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await ViewHistory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'History session deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete session', error: error.message });
    }
};
