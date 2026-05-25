// Seed 20 sample flashcards for an existing user.
// Usage: node scripts/seedFlashcards.js <email>
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/user.js';
import Flashcard from '../models/flashcard.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const cards = [
    // Q&A
    {
        question: 'What is the value of pi to 2 decimal places?',
        answer: '3.14',
        category: 'Math',
        cardType: 'qa',
    },
    {
        question: 'What is the SI unit of force?',
        answer: 'Newton',
        category: 'Physics',
        cardType: 'qa',
    },
    {
        question: 'What is the chemical symbol for gold?',
        answer: 'Au',
        category: 'Chemistry',
        cardType: 'qa',
    },
    {
        question: 'What is the powerhouse of the cell?',
        answer: 'Mitochondria',
        category: 'Biology',
        cardType: 'qa',
    },
    {
        question: 'What is the square root of 144?',
        answer: '12',
        category: 'Math',
        cardType: 'qa',
    },
    {
        question: 'What is the speed of light in vacuum (m/s)?',
        answer: '299,792,458',
        category: 'Physics',
        cardType: 'qa',
    },
    {
        question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
        answer: 'Carbon dioxide',
        category: 'Science',
        cardType: 'qa',
    },

    // Single correct answer
    {
        question: 'Which of these is a prime number?',
        category: 'Math',
        cardType: 'single',
        options: ['4', '9', '11', '15'],
        correctAnswers: [2],
    },
    {
        question: "Newton's first law of motion is also known as the law of...?",
        category: 'Physics',
        cardType: 'single',
        options: ['Inertia', 'Acceleration', 'Action-reaction', 'Gravity'],
        correctAnswers: [0],
    },
    {
        question: 'What is the chemical formula H₂O commonly known as?',
        category: 'Chemistry',
        cardType: 'single',
        options: ['Salt', 'Water', 'Sugar', 'Oxygen'],
        correctAnswers: [1],
    },
    {
        question: 'Which organ in the human body pumps blood?',
        category: 'Biology',
        cardType: 'single',
        options: ['Brain', 'Liver', 'Heart', 'Lung'],
        correctAnswers: [2],
    },
    {
        question: 'What is 7 × 8?',
        category: 'Math',
        cardType: 'single',
        options: ['54', '56', '64', '48'],
        correctAnswers: [1],
    },
    {
        question: 'Which metal has the highest electrical conductivity?',
        category: 'Physics',
        cardType: 'single',
        options: ['Iron', 'Silver', 'Copper', 'Gold'],
        correctAnswers: [1],
    },
    {
        question: 'Which planet is closest to the Sun?',
        category: 'Science',
        cardType: 'single',
        options: ['Venus', 'Earth', 'Mercury', 'Mars'],
        correctAnswers: [2],
    },

    // Multiple correct answers
    {
        question: 'Which of these are prime numbers?',
        category: 'Math',
        cardType: 'multiple',
        options: ['2', '4', '7', '9', '11'],
        correctAnswers: [0, 2, 4],
    },
    {
        question: 'Which of the following are forms of energy?',
        category: 'Physics',
        cardType: 'multiple',
        options: ['Kinetic', 'Potential', 'Mass', 'Thermal', 'Time'],
        correctAnswers: [0, 1, 3],
    },
    {
        question: 'Which of these are noble gases?',
        category: 'Chemistry',
        cardType: 'multiple',
        options: ['Helium', 'Oxygen', 'Neon', 'Hydrogen', 'Argon'],
        correctAnswers: [0, 2, 4],
    },
    {
        question: 'Which of these animals are mammals?',
        category: 'Biology',
        cardType: 'multiple',
        options: ['Dolphin', 'Shark', 'Bat', 'Eagle', 'Whale'],
        correctAnswers: [0, 2, 4],
    },
    {
        question: 'Which of the following are renewable energy sources?',
        category: 'Science',
        cardType: 'multiple',
        options: ['Solar', 'Coal', 'Wind', 'Oil', 'Hydro'],
        correctAnswers: [0, 2, 4],
    },
    {
        question: 'Which of these numbers are even?',
        category: 'Math',
        cardType: 'multiple',
        options: ['3', '6', '7', '10', '12'],
        correctAnswers: [1, 3, 4],
    },
];

const run = async () => {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: node scripts/seedFlashcards.js <email>');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
        console.error(`No user found with email "${email}".`);
        await mongoose.disconnect();
        process.exit(1);
    }

    const docs = cards.map((c) => ({ ...c, user: user._id }));
    const inserted = await Flashcard.insertMany(docs);

    console.log(`✓ Inserted ${inserted.length} flashcards for ${user.email}`);
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
