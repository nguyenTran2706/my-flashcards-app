import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Simple flashcards for everyday study
                    </h1>

                    <p className="hero-subtitle">
                        Keep a small collection of cards for the topics you actually care about.
                        Nothing fancy – just a straightforward way to remember things.
                    </p>

                    <div className="hero-actions">
                        <Link to="/study" className="btn btn-primary">
                            Go to your cards
                        </Link>
                        <Link to="/study" className="btn btn-secondary">
                            Add a new card
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Built to stay out of your way</h2>
                    <p className="section-subtitle">
                        A lightweight layout, a single place to add and review cards, and just
                        enough structure to keep things organised.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Create cards quickly</h3>
                        <p>
                            Add a question, an answer, and a category. That&apos;s it – no extra
                            fields or steps.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Review at your own pace</h3>
                        <p>
                            Flip cards when you&apos;re ready and edit them as your understanding
                            improves.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Keep everything in one place</h3>
                        <p>
                            Use categories to group topics so you can come back to them later
                            without digging through notebooks.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
