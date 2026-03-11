import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    question: {
        type: String,
        required: [true, 'Please add a question'],
    },
    answer: {
        type: String,
        required: [true, 'Please add an answer'],
    },
    category: {
        type: String,
        default: 'General',
    },
}, {
    timestamps: true,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;