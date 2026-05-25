import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { useTransientMessage } from '../hooks/useTransientMessage';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '');

const AdminUsersPage = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useTransientMessage();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.adminListUsers();
            setUsers(data);
        } catch (err) {
            setError('Could not load users. Are you signed in as an admin?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, email) => {
        if (!window.confirm(`Delete ${email} and all their flashcards + history? This is permanent.`)) {
            return;
        }
        try {
            await api.adminDeleteUser(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setSuccess('User deleted');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not delete that user.');
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-spinner"></div>
                <p>Loading users…</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="history-header">
                <h1>All Users</h1>
                <p>View each user's learning history or remove an account.</p>
            </div>

            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Sessions</th>
                        <th>Avg score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`role-badge role-${u.role}`}>{u.role}</span>
                            </td>
                            <td>{formatDate(u.createdAt)}</td>
                            <td>{u.sessionCount}</td>
                            <td>{u.averageScore !== null ? `${u.averageScore}%` : '—'}</td>
                            <td className="admin-row-actions">
                                <Link
                                    to={`/admin/users/${u._id}`}
                                    className="btn btn-secondary btn-small"
                                >
                                    View history
                                </Link>
                                {u._id !== user._id && (
                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDelete(u._id, u.email)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;
