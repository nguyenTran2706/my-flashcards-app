import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import FlashcardForm from './components/flashcardForm';
import FlashcardList from './components/flashcardList';
import * as api from './services/api';
import './App.css';

const StudyPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const data = await api.getFlashcards();
            setFlashcards(data);
        } catch (err) {
            setError('Could not load flashcards from the database.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setError('Failed to save the flashcard.');
        }
    };

    const handleDelete = async (id) => {
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

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/study" element={<StudyPage />} />
            </Routes>
        </>
    );
};

export default App;