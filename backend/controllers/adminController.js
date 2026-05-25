import User from '../models/user.js';
import Flashcard from '../models/flashcard.js';
import ViewHistory from '../models/viewHistory.js';

// @desc    List all users with aggregate stats (session count, average score)
// @route   GET /api/admin/users
// @access  Admin
export const listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();

        // One aggregation call instead of N — keeps things fast as the user count grows.
        const stats = await ViewHistory.aggregate([
            {
                $group: {
                    _id: '$user',
                    sessionCount: { $sum: 1 },
                    averageScore: { $avg: '$scorePercent' },
                },
            },
        ]);

        const statsByUser = new Map(stats.map((s) => [s._id.toString(), s]));
        const enriched = users.map((u) => {
            const s = statsByUser.get(u._id.toString());
            return {
                ...u,
                sessionCount: s?.sessionCount || 0,
                averageScore: s ? Math.round(s.averageScore) : null,
            };
        });

        res.status(200).json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// @desc    List one user's full review history
// @route   GET /api/admin/users/:id/history
// @access  Admin
export const getUserHistory = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id).select('-password');
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        const sessions = await ViewHistory.find({ user: req.params.id }).sort({ completedAt: -1 });
        res.status(200).json({ user: targetUser, sessions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user history', error: error.message });
    }
};

// @desc    Delete a user and cascade their flashcards + history
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Admins cannot delete their own account here' });
        }

        const target = await User.findById(req.params.id);
        if (!target) return res.status(404).json({ message: 'User not found' });

        await Flashcard.deleteMany({ user: req.params.id });
        await ViewHistory.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'User and all their data deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};
