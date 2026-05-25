import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../services/api';
import SessionCard from './SessionCard';

const AdminUserDetailPage = () => {
    const { id } = useParams();
    const [targetUser, setTargetUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const data = await api.adminGetUserHistory(id);
            setTargetUser(data.user);
            setSessions(data.sessions);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not load this user.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-spinner"></div>
                <p>Loading user history…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="error-banner">{error}</div>
                <Link to="/admin/users" className="btn btn-secondary">
                    ← Back to users
                </Link>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="history-header">
                <Link to="/admin/users" className="inline-link back-link">
                    ← All users
                </Link>
                <h1>{targetUser.name}</h1>
                <p>{targetUser.email}</p>
            </div>

            {sessions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No review sessions yet</p>
                    <span className="empty-hint">
                        This user hasn't completed any quizzes.
                    </span>
                </div>
            ) : (
                <ul className="history-list">
                    {sessions.map((s) => (
                        <SessionCard key={s._id} session={s} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminUserDetailPage;
