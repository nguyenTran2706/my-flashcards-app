import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import FlashcardForm from './components/flashcardForm';
import FlashcardList from './components/flashcardList';
import ReviewPage from './components/ReviewPage';
import HistoryPage from './components/HistoryPage';
import AdminUsersPage from './components/AdminUsersPage';
import AdminUserDetailPage from './components/AdminUserDetailPage';
import AuthForms from './components/AuthForms';
import * as api from './services/api';
import './App.css';

const emptyForm = () => ({
    question: '',
    answer: '',
    category: 'General',
    cardType: 'qa',
    options: ['', ''],
    correctAnswers: [],
});

// Deep-compare an edit form against the snapshot of the card we started editing.
// Returns true when nothing meaningful has changed, so we can block a no-op update.
const isUnchanged = (original, current) => {
    if (!original) return false;
    if (original.question !== current.question) return false;
    if (original.cardType !== current.cardType) return false;
    if ((original.category || 'General') !== (current.category || 'General')) return false;
    if (original.cardType === 'qa') return original.answer === current.answer;

    const a = original.options || [];
    const b = current.options || [];
    if (a.length !== b.length || !a.every((opt, i) => opt === b[i])) return false;

    const sortedA = [...(original.correctAnswers || [])].sort((x, y) => x - y);
    const sortedB = [...(current.correctAnswers || [])].sort((x, y) => x - y);
    return sortedA.length === sortedB.length && sortedA.every((v, i) => v === sortedB[i]);
};

const StudyPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [editingOriginal, setEditingOriginal] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);

    const filteredFlashcards = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return flashcards;
        return flashcards.filter((card) => {
            if (card.question?.toLowerCase().includes(q)) return true;
            if (card.answer?.toLowerCase().includes(q)) return true;
            if (card.category?.toLowerCase().includes(q)) return true;
            if (card.options?.some((opt) => opt?.toLowerCase().includes(q))) return true;
            return false;
        });
    }, [flashcards, searchQuery]);

    useEffect(() => {
        if (user) {
            fetchCards();
        }
    }, [user]);

    // Auto-clear success messages so they read like toasts.
    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(''), 3000);
        return () => clearTimeout(t);
    }, [success]);

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
            .filter((i) => i !== index)
            .map((i) => (i > index ? i - 1 : i));
        setFormData({ ...formData, options: newOptions, correctAnswers: newCorrectAnswers });
    };

    const handleCorrectAnswerChange = (index) => {
        if (formData.cardType === 'single') {
            setFormData({ ...formData, correctAnswers: [index] });
        } else if (formData.cardType === 'multiple') {
            if (formData.correctAnswers.includes(index)) {
                setFormData({
                    ...formData,
                    correctAnswers: formData.correctAnswers.filter((i) => i !== index),
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
            const filledOptions = formData.options.filter((o) => o.trim() !== '');
            if (filledOptions.length < 2) {
                return setError('Please add at least 2 options.');
            }
            if (formData.correctAnswers.length === 0) {
                return setError('Please select at least one correct answer.');
            }
        }

        // Block no-op updates so we don't fire a pointless PUT request.
        if (editingId && isUnchanged(editingOriginal, formData)) {
            return setError('No changes detected — edit something before saving.');
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
                setFlashcards(
                    flashcards.map((card) => (card._id === editingId ? updatedCard : card)),
                );
                setEditingId(null);
                setEditingOriginal(null);
                setSuccess('Flashcard updated');
            } else {
                const newCard = await api.createFlashcard(submitData);
                setFlashcards([...flashcards, newCard]);
                setSuccess('Flashcard saved');
            }
            setFormData(emptyForm());
            setError('');
        } catch (err) {
            setError('Failed to save the flashcard. ' + (err.response?.data?.message || ''));
        }
    };

    const handleDelete = async (id) => {
        if (!user) return;
        try {
            await api.deleteFlashcard(id);
            setFlashcards(flashcards.filter((card) => card._id !== id));
            setSuccess('Flashcard deleted');
        } catch (err) {
            setError('Failed to delete the flashcard.');
        }
    };

    const handleEdit = (card) => {
        const snapshot = {
            question: card.question,
            answer: card.answer || '',
            category: card.category || 'General',
            cardType: card.cardType || 'qa',
            options: card.options && card.options.length > 0 ? card.options : ['', ''],
            correctAnswers: card.correctAnswers || [],
        };
        setFormData(snapshot);
        setEditingOriginal(snapshot);
        setEditingId(card._id);
        setError('');
    };

    const handleCancelEdit = () => {
        setFormData(emptyForm());
        setEditingId(null);
        setEditingOriginal(null);
        setError('');
    };

    if (!user) {
        return (
            <div
                className="study-page"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontSize: '1.8rem', color: 'var(--gray-900)', marginBottom: '16px' }}>
                    Sign in to start studying
                </h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
                    You need an account to create and save your personal flashcards.
                </p>
                <Link to="/auth" className="btn btn-primary">
                    Go to Login / Sign Up
                </Link>
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
            {success && <div className="success-banner">{success}</div>}

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
                flashcards={filteredFlashcards}
                totalCount={flashcards.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

// Gates admin-only routes. Non-admins bounce to the landing page.
const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsersPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/users/:id"
                    element={
                        <AdminRoute>
                            <AdminUserDetailPage />
                        </AdminRoute>
                    }
                />
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
