import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import FlashcardForm from './components/flashcardForm';
import FlashcardList from './components/flashcardList';
import AuthForms from './components/AuthForms';
import * as api from './services/api';
import './App.css';

const StudyPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return setError('You must be signed in to create flashcards.');

        try {
            if (editingId) {
                const updatedCard = await api.updateFlashcard(editingId, formData);
                setFlashcards(flashcards.map(card => card._id === editingId ? updatedCard : card));
                setEditingId(null);
            } else {
                const newCard = await api.createFlashcard(formData);
                setFlashcards([...flashcards, newCard]);
            }
            setFormData({ question: '', answer: '', category: 'General' });
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
        setFormData({ question: card.question, answer: card.answer, category: card.category });
        setEditingId(card._id);
    };

    const handleCancelEdit = () => {
        setFormData({ question: '', answer: '', category: 'General' });
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