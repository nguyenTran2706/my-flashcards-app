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
        question: 'What is the capital city of Japan?',
        answer: 'Tokyo',
        category: 'Geography',
        cardType: 'qa',
    },
    {
        question: 'In which year did World War II end?',
        answer: '1945',
        category: 'History',
        cardType: 'qa',
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        answer: 'William Shakespeare',
        category: 'Literature',
        cardType: 'qa',
    },
    {
        question: 'Who painted the Mona Lisa?',
        answer: 'Leonardo da Vinci',
        category: 'Art',
        cardType: 'qa',
    },
    {
        question: 'What is the largest planet in our solar system?',
        answer: 'Jupiter',
        category: 'Astronomy',
        cardType: 'qa',
    },
    {
        question: 'What is the tallest mountain above sea level?',
        answer: 'Mount Everest',
        category: 'Geography',
        cardType: 'qa',
    },
    {
        question: 'How many players from one team are on the field in a standard game of soccer?',
        answer: 'Eleven',
        category: 'Sports',
        cardType: 'qa',
    },

    // Single correct answer
    {
        question: 'Which is the largest ocean on Earth?',
        category: 'Geography',
        cardType: 'single',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctAnswers: [3],
    },
    {
        question: 'Who was the first President of the United States?',
        category: 'History',
        cardType: 'single',
        options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
        correctAnswers: [1],
    },
    {
        question: "Which composer wrote the Ninth Symphony featuring 'Ode to Joy'?",
        category: 'Music',
        cardType: 'single',
        options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'],
        correctAnswers: [2],
    },
    {
        question: "In which language was the original 'Don Quixote' written?",
        category: 'Literature',
        cardType: 'single',
        options: ['Italian', 'Spanish', 'French', 'Portuguese'],
        correctAnswers: [1],
    },
    {
        question: 'What is the largest land animal on Earth?',
        category: 'Nature',
        cardType: 'single',
        options: ['African Elephant', 'Giraffe', 'Hippopotamus', 'Rhinoceros'],
        correctAnswers: [0],
    },
    {
        question: 'The Great Pyramid of Giza is located in which country?',
        category: 'History',
        cardType: 'single',
        options: ['Mexico', 'Iraq', 'Egypt', 'Greece'],
        correctAnswers: [2],
    },
    {
        question: 'Who is credited with inventing the World Wide Web?',
        category: 'Technology',
        cardType: 'single',
        options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Alan Turing'],
        correctAnswers: [2],
    },

    // Multiple correct answers
    {
        question: 'Which of these are capital cities?',
        category: 'Geography',
        cardType: 'multiple',
        options: ['Sydney', 'Paris', 'New York', 'Cairo', 'Ottawa'],
        correctAnswers: [1, 3, 4],
    },
    {
        question: 'Which of these are planets in our solar system?',
        category: 'Astronomy',
        cardType: 'multiple',
        options: ['Mars', 'Venus', 'Pluto', 'Saturn', 'Europa'],
        correctAnswers: [0, 1, 3],
    },
    {
        question: 'Which of these plays were written by William Shakespeare?',
        category: 'Literature',
        cardType: 'multiple',
        options: ['The Odyssey', 'Hamlet', 'Macbeth', 'War and Peace', 'Othello'],
        correctAnswers: [1, 2, 4],
    },
    {
        question: 'Which of these countries are in Europe?',
        category: 'Geography',
        cardType: 'multiple',
        options: ['Spain', 'Germany', 'Italy', 'Egypt', 'Brazil'],
        correctAnswers: [0, 1, 2],
    },
    {
        question: 'Which of these animals are primates?',
        category: 'Nature',
        cardType: 'multiple',
        options: ['Dolphin', 'Gorilla', 'Chimpanzee', 'Orangutan', 'Kangaroo'],
        correctAnswers: [1, 2, 3],
    },
    {
        question: 'Which of these are among the Seven Wonders of the Ancient World?',
        category: 'History',
        cardType: 'multiple',
        options: [
            'Eiffel Tower',
            'Great Pyramid of Giza',
            'Statue of Liberty',
            'Hanging Gardens of Babylon',
            'Colossus of Rhodes',
        ],
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
