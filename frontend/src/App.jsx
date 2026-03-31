import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import FlashcardForm from './components/flashcardForm';
import FlashcardList from './components/flashcardList';
import ReviewPage from './components/ReviewPage';
import AuthForms from './components/AuthForms';
import * as api from './services/api';
import './App.css';

const StudyPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        cardType: 'qa',
        options: ['', ''],
        correctAnswers: [],
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchCards();
        }
    }, [user]);

    const fetchCards = async () => {
        try {
            const data = await api.getFlashcards();
            setFlashcards(data);
        } catch (err) {
            setError('Could not load flashcards. Please sign in again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cardType') {
            // Reset options and answers when switching type
            setFormData({
                ...formData,
                cardType: value,
                options: value === 'qa' ? [] : ['', ''],
                correctAnswers: [],
                answer: '',
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleAddOption = () => {
        if (formData.options.length < 6) {
            setFormData({ ...formData, options: [...formData.options, ''] });
        }
    };

    const handleRemoveOption = (index) => {
        if (formData.options.length <= 2) return;
        const newOptions = formData.options.filter((_, i) => i !== index);
        // Adjust correctAnswers indices
        const newCorrectAnswers = formData.correctAnswers
            .filter(i => i !== index)
            .map(i => (i > index ? i - 1 : i));
        setFormData({ ...formData, options: newOptions, correctAnswers: newCorrectAnswers });
    };

    const handleCorrectAnswerChange = (index) => {
        if (formData.cardType === 'single') {
            setFormData({ ...formData, correctAnswers: [index] });
        } else if (formData.cardType === 'multiple') {
            if (formData.correctAnswers.includes(index)) {
                setFormData({
                    ...formData,
                    correctAnswers: formData.correctAnswers.filter(i => i !== index),
                });
            } else {
                setFormData({
                    ...formData,
                    correctAnswers: [...formData.correctAnswers, index],
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return setError('You must be signed in to create flashcards.');

        // Validation for MCQ types
        if (formData.cardType === 'single' || formData.cardType === 'multiple') {
            const filledOptions = formData.options.filter(o => o.trim() !== '');
            if (filledOptions.length < 2) {
                return setError('Please add at least 2 options.');
            }
            if (formData.correctAnswers.length === 0) {
                return setError('Please select at least one correct answer.');
            }
        }

        try {
            const submitData = {
                question: formData.question,
                answer: formData.answer,
                category: formData.category || 'General',
                cardType: formData.cardType,
                options: formData.cardType === 'qa' ? [] : formData.options,
                correctAnswers: formData.cardType === 'qa' ? [] : formData.correctAnswers,
            };

            if (editingId) {
                const updatedCard = await api.updateFlashcard(editingId, submitData);
                setFlashcards(flashcards.map(card => card._id === editingId ? updatedCard : card));
                setEditingId(null);
            } else {
                const newCard = await api.createFlashcard(submitData);
                setFlashcards([...flashcards, newCard]);
            }
            setFormData({
                question: '',
                answer: '',
                category: 'General',
                cardType: 'qa',
                options: ['', ''],
                correctAnswers: [],
            });
            setError('');
        } catch (err) {
            setError('Failed to save the flashcard. ' + (err.response?.data?.message || ''));
        }
    };

    const handleDelete = async (id) => {
        if (!user) return;
        try {
            await api.deleteFlashcard(id);
            setFlashcards(flashcards.filter(card => card._id !== id));
        } catch (err) {
            setError('Failed to delete the flashcard.');
        }
    };

    const handleEdit = (card) => {
        setFormData({
            question: card.question,
            answer: card.answer || '',
            category: card.category || 'General',
            cardType: card.cardType || 'qa',
            options: card.options && card.options.length > 0 ? card.options : ['', ''],
            correctAnswers: card.correctAnswers || [],
        });
        setEditingId(card._id);
    };

    const handleCancelEdit = () => {
        setFormData({
            question: '',
            answer: '',
            category: 'General',
            cardType: 'qa',
            options: ['', ''],
            correctAnswers: [],
        });
        setEditingId(null);
    };

    if (!user) {
        return (
            <div className="study-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--gray-900)', marginBottom: '16px' }}>Sign in to start studying</h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>You need an account to create and save your personal flashcards.</p>
                <Link to="/auth" className="btn btn-primary">Go to Login / Sign Up</Link>
            </div>
        );
    }

    return (
        <div className="study-page">
            <div className="study-header">
                <h1>Study Dashboard</h1>
                <p>Create and review your flashcards</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <FlashcardForm
                formData={formData}
                editingId={editingId}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                onOptionChange={handleOptionChange}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onCorrectAnswerChange={handleCorrectAnswerChange}
            />

            <FlashcardList
                flashcards={flashcards}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/auth" element={<AuthForms />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;