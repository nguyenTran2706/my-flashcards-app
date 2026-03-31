import Flashcard from '../models/flashcard.js';
export const getCards = async (req, res) => {
    try {
        const cards = await Flashcard.find({ user: req.user.id });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch flashcards', error: error.message });
    }
};

export const createCard = async (req, res) => {
    try {
        const { question, answer, category, cardType, options, correctAnswers } = req.body;

        // Auto-generate answer from correct options for MCQ cards
        let finalAnswer = answer || '';
        if ((cardType === 'single' || cardType === 'multiple') && options && correctAnswers) {
            finalAnswer = correctAnswers.map(i => options[i]).filter(Boolean).join(', ');
        }

        const newCard = await Flashcard.create({
            question,
            answer: finalAnswer,
            category: category || 'General',
            cardType: cardType || 'qa',
            options: options || [],
            correctAnswers: correctAnswers || [],
            user: req.user.id
        });
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create flashcard', error: error.message });
    }
};

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

        const updateData = { ...req.body };

        // Auto-generate answer from correct options for MCQ cards
        const cardType = updateData.cardType || flashcard.cardType;
        const options = updateData.options || flashcard.options;
        const correctAnswers = updateData.correctAnswers || flashcard.correctAnswers;

        if ((cardType === 'single' || cardType === 'multiple') && options && correctAnswers) {
            updateData.answer = correctAnswers.map(i => options[i]).filter(Boolean).join(', ');
        }

        const updatedCard = await Flashcard.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update flashcard', error: error.message });
    }
};

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