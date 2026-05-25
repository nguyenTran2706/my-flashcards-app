import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { useTransientMessage } from '../hooks/useTransientMessage';
import SessionCard from './SessionCard';

const HistoryPage = () => {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useTransientMessage();

    useEffect(() => {
        if (user) fetchSessions();
    }, [user]);

    const fetchSessions = async () => {
        try {
            const data = await api.getHistory();
            setSessions(data);
        } catch (err) {
            setError('Could not load your history.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteHistory(id);
            setSessions((prev) => prev.filter((s) => s._id !== id));
            setSuccess('Session deleted');
        } catch (err) {
            setError('Could not delete that session.');
        }
    };

    const handleSaveNotes = async (id, notes) => {
        try {
            const updated = await api.updateHistoryNotes(id, notes);
            setSessions((prev) => prev.map((s) => (s._id === id ? updated : s)));
            setSuccess('Note saved');
        } catch (err) {
            setError('Could not save your note.');
        }
    };

    if (!user) {
        return (
            <div className="history-page signed-out">
                <h2>Sign in to view your history</h2>
                <p>Your past review sessions are saved to your account.</p>
                <Link to="/auth" className="btn btn-primary">
                    Go to Login / Sign Up
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="history-page">
                <div className="loading-spinner"></div>
                <p>Loading your history…</p>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="history-header">
                <h1>Your Review History</h1>
                <p>Every quiz you've completed, newest first.</p>
            </div>

            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            {sessions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No review sessions yet</p>
                    <span className="empty-hint">
                        Head to{' '}
                        <Link to="/review" className="inline-link">
                            Review
                        </Link>{' '}
                        to take your first quiz.
                    </span>
                </div>
            ) : (
                <ul className="history-list">
                    {sessions.map((s) => (
                        <SessionCard
                            key={s._id}
                            session={s}
                            onDelete={handleDelete}
                            onSaveNotes={handleSaveNotes}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryPage;
