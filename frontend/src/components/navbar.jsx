import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

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
                <Link to="/study" className="nav-cta">
                    + Create
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
