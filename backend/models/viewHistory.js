import mongoose from 'mongoose';

// Embedded answer snapshot — we copy question/answer text so history survives
// the original flashcard being deleted later.
const answerSnapshotSchema = new mongoose.Schema(
    {
        flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' },
        question: { type: String, required: true },
        userAnswer: { type: String, default: '' },
        correctAnswer: { type: String, default: '' },
        cardType: { type: String, enum: ['qa', 'single', 'multiple'], required: true },
        isCorrect: { type: Boolean, required: true },
    },
    { _id: false },
);

const viewHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date, default: Date.now },
        totalCards: { type: Number, required: true },
        correctCount: { type: Number, required: true },
        scorePercent: { type: Number, required: true },
        answers: { type: [answerSnapshotSchema], default: [] },
        notes: { type: String, default: '' },
    },
    { timestamps: true },
);

const ViewHistory = mongoose.model('ViewHistory', viewHistorySchema);

export default ViewHistory;
