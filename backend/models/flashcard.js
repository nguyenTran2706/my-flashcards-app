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
        default: '',
    },
    category: {
        type: String,
        default: 'General',
    },
    cardType: {
        type: String,
        enum: ['qa', 'single', 'multiple'],
        default: 'qa',
    },
    options: {
        type: [String],
        default: [],
    },
    correctAnswers: {
        type: [Number],
        default: [],
    },
}, {
    timestamps: true,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;