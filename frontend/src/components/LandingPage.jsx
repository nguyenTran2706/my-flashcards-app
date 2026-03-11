import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">
                    ✨ The smarter way to study
                </div>

                <h1 className="hero-title">
                    Master anything with<br />
                    <span className="gradient-text">interactive flashcards</span>
                </h1>

                <p className="hero-subtitle">
                    Create, study, and conquer any subject. FlashMaster makes learning
                    faster, smarter, and more engaging than ever before.
                </p>

                <div className="hero-actions">
                    <Link to="/study" className="btn btn-primary">
                        Get Started Free →
                    </Link>
                    <Link to="/study" className="btn btn-secondary">
                        Browse Cards
                    </Link>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Flashcards Created</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Active Learners</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <p className="section-tag">Why FlashMaster?</p>
                    <h2 className="section-title">Everything you need to learn</h2>
                    <p className="section-subtitle">
                        Powerful tools to help you create, study, and retain knowledge effectively.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Create Instantly</h3>
                        <p>
                            Build your own flashcard sets in seconds. Add questions, answers,
                            and organize by category for structured learning.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Interactive Study</h3>
                        <p>
                            Flip through cards with smooth animations. Test yourself and
                            actively recall information to boost memory retention.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>
                            Monitor how many cards you've mastered. Stay motivated with a clear
                            overview of your learning journey.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
