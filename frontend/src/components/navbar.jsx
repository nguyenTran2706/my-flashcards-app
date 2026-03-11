import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="logo-icon">⚡</div>
                <span>FlashMaster</span>
            </Link>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Home
                </Link>
                <Link
                    to="/study"
                    className={`nav-link ${location.pathname === '/study' ? 'active' : ''}`}
                >
                    Study
                </Link>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--gray-600)' }}>
                            {user.name}
                        </span>
                        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="nav-cta">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
