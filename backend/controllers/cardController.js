import Flashcard from '../models/flashcard.js'; // Make sure the casing matches your file name exactly

// @desc    Get all flashcards (READ)
// @route   GET /api/flashcards
export const getCards = async (req, res) => {
    try {
        const cards = await Flashcard.find({ user: req.user.id });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch flashcards', error: error.message });
    }
};

// @desc    Create a new flashcard (CREATE)
// @route   POST /api/flashcards
export const createCard = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const newCard = await Flashcard.create({
            question,
            answer,
            category,
            user: req.user.id
        });
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create flashcard', error: error.message });
    }
};

// @desc    Update a flashcard (UPDATE)
// @route   PUT /api/flashcards/:id
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const flashcard = await Flashcard.findById(id);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        // Check for user ownership
        if (flashcard.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedCard = await Flashcard.findByIdAndUpdate(id, req.body, {
            new: true, // Returns the updated document instead of the old one
            runValidators: true // Ensures the update follows your Schema rules
        });

        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update flashcard', error: error.message });
    }
};

// @desc    Delete a flashcard (DELETE)
// @route   DELETE /api/flashcards/:id
export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const flashcard = await Flashcard.findById(id);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        // Check for user ownership
        if (flashcard.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Flashcard.findByIdAndDelete(id);

        res.status(200).json({ message: 'Flashcard successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete flashcard', error: error.message });
    }
};