import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const AuthForms = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let userData;
            if (isLogin) {
                userData = await api.login({ email: formData.email, password: formData.password });
            } else {
                userData = await api.register(formData);
            }

            login(userData);
            navigate('/study'); // Go to study dashboard after login/register
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="card-form" style={{ maxWidth: '400px', width: '100%', margin: '0 20px', height: 'fit-content' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                className="form-input"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" style={{ marginTop: '8px' }} disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;
