import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const ReviewPage = () => {
    const { user } = useContext(AuthContext);
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [qaAnswer, setQaAnswer] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [answersHistory, setAnswersHistory] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCards();
        }
    }, [user]);

    const fetchCards = async () => {
        try {
            const data = await api.getFlashcards();
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setFlashcards(shuffled);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const currentCard = flashcards[currentIndex];

    const handleSelectAnswer = (index) => {
        if (isSubmitted) return;
        if (!currentCard) return;

        if (currentCard.cardType === 'single') {
            setSelectedAnswers([index]);
        } else if (currentCard.cardType === 'multiple') {
            if (selectedAnswers.includes(index)) {
                setSelectedAnswers(selectedAnswers.filter(i => i !== index));
            } else {
                setSelectedAnswers([...selectedAnswers, index]);
            }
        }
    };

    const handleSubmitAnswer = () => {
        if (!currentCard) return;

        let isCorrect = false;

        if (currentCard.cardType === 'qa') {
            isCorrect = qaAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();
            setAnswersHistory(prev => [...prev, {
                cardIndex: currentIndex,
                userAnswer: qaAnswer.trim(),
                selectedIndices: [],
                isCorrect,
            }]);
        } else {
            const correct = [...(currentCard.correctAnswers || [])].sort();
            const selected = [...selectedAnswers].sort();
            isCorrect = correct.length === selected.length && correct.every((val, idx) => val === selected[idx]);
            setAnswersHistory(prev => [...prev, {
                cardIndex: currentIndex,
                userAnswer: selectedAnswers.map(i => currentCard.options[i]).join(', '),
                selectedIndices: [...selectedAnswers],
                isCorrect,
            }]);
        }

        if (isCorrect) {
            setScore(score + 1);
        }

        setIsSubmitted(true);
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswers([]);
            setQaAnswer('');
            setIsSubmitted(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrentIndex(0);
        setSelectedAnswers([]);
        setQaAnswer('');
        setIsSubmitted(false);
        setScore(0);
        setIsFinished(false);
        setShowSummary(false);
        setAnswersHistory([]);
    };

    if (!user) {
        return (
            <div className="review-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--gray-900)', marginBottom: '16px' }}>Sign in to review</h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>You need an account to review your flashcards.</p>
                <Link to="/auth" className="btn btn-primary">Go to Login / Sign Up</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="review-page">
                <div className="review-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your flashcards...</p>
                </div>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <div className="review-page">
                <div className="review-empty">
                    <div className="empty-icon">📝</div>
                    <h2>No flashcards to review</h2>
                    <p>Create some flashcards first, then come back to review them!</p>
                    <Link to="/study" className="btn btn-primary">Go to Study</Link>
                </div>
            </div>
        );
    }

    // ===== SUMMARY VIEW =====
    if (isFinished && showSummary) {
        return (
            <div className="review-page">
                <div className="review-header">
                    <h1>Review Summary</h1>
                    <p>All questions and your answers at a glance</p>
                </div>

                <div className="summary-score-bar">
                    <span className="summary-score-text">
                        Score: <strong>{score}/{flashcards.length}</strong> ({Math.round((score / flashcards.length) * 100)}%)
                    </span>
                    <div className="summary-legend">
                        <span className="legend-item correct">Correct</span>
                        <span className="legend-item wrong">Incorrect</span>
                    </div>
                </div>

                <div className="summary-list">
                    {flashcards.map((card, idx) => {
                        const history = answersHistory[idx];
                        if (!history) return null;
                        const isCorrect = history.isCorrect;

                        return (
                            <div key={idx} className={`summary-card ${isCorrect ? 'summary-correct' : 'summary-wrong'}`}>
                                <div className="summary-card-header">
                                    <span className="summary-q-number">Q{idx + 1}</span>
                                    <span className={`summary-result-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                    <span className="summary-card-type">
                                        {card.cardType === 'qa' ? 'Q&A' : card.cardType === 'single' ? 'Single' : 'Multiple'}
                                    </span>
                                </div>

                                <h3 className="summary-question">{card.question}</h3>

                                {/* Q&A type */}
                                {card.cardType === 'qa' && (
                                    <div className="summary-answers">
                                        <div className={`summary-answer-row ${isCorrect ? 'correct' : 'wrong'}`}>
                                            <span className="summary-label">Your answer:</span>
                                            <span className="summary-value">{history.userAnswer || '(no answer)'}</span>
                                        </div>
                                        {!isCorrect && (
                                            <div className="summary-answer-row correct">
                                                <span className="summary-label">Correct answer:</span>
                                                <span className="summary-value">{card.answer}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* MCQ type */}
                                {(card.cardType === 'single' || card.cardType === 'multiple') && card.options && (
                                    <div className="summary-options">
                                        {card.options.map((opt, optIdx) => {
                                            const wasSelected = (history.selectedIndices || []).includes(optIdx);
                                            const isCorrectOption = (card.correctAnswers || []).includes(optIdx);
                                            let optionClass = 'summary-option';
                                            if (isCorrectOption) optionClass += ' correct-option';
                                            if (wasSelected && !isCorrectOption) optionClass += ' wrong-option';
                                            if (wasSelected) optionClass += ' was-selected';

                                            return (
                                                <div key={optIdx} className={optionClass}>
                                                    <span className="summary-opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                                                    <span className="summary-opt-text">{opt}</span>
                                                    {wasSelected && <span className="summary-opt-tag selected-tag">Your answer</span>}
                                                    {isCorrectOption && <span className="summary-opt-tag correct-tag">Correct</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="summary-bottom-actions">
                    <button className="btn btn-secondary" onClick={() => setShowSummary(false)}>Back to Results</button>
                    <button className="btn btn-primary" onClick={handleRestart}>Try Again</button>
                    <Link to="/study" className="btn btn-secondary">Back to Study</Link>
                </div>
            </div>
        );
    }

    // ===== FINISHED SCREEN =====
    if (isFinished) {
        const percentage = Math.round((score / flashcards.length) * 100);
        return (
            <div className="review-page">
                <div className="review-finished">
                    <div className="finish-icon">
                        {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                    </div>
                    <h2 className="finish-title">Review Complete!</h2>
                    <div className="score-display">
                    </div>                        <div className="score-circle">
                        <span className="score-number">{percentage}%</span>
                    </div>
                    <p className="score-detail">{score} out of {flashcards.length} correct</p>
                </div>
                <div className="finish-actions">
                    <button className="btn btn-primary" onClick={() => setShowSummary(true)}>View All Answers</button>
                    <button className="btn btn-secondary" onClick={handleRestart}>Try Again</button>
                    <Link to="/study" className="btn btn-secondary">Back to Study</Link>
                </div>

            </div>
        );
    }

    const getOptionClass = (index) => {
        let classes = 'review-option';
        if (selectedAnswers.includes(index)) classes += ' selected';
        if (isSubmitted) {
            if ((currentCard.correctAnswers || []).includes(index)) {
                classes += ' correct';
            } else if (selectedAnswers.includes(index)) {
                classes += ' wrong';
            }
        }
        return classes;
    };

    return (
        <div className="review-page">
            <div className="review-header">
                <h1>Review Mode</h1>
                <p>Test your knowledge by answering questions</p>
            </div>

            {/* Progress Bar */}
            <div className="review-progress-container">
                <div className="review-progress-bar">
                    <div
                        className="review-progress-fill"
                        style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                    ></div>
                </div>
                <div className="review-progress-info">
                    <span className="progress-count">Question {currentIndex + 1} of {flashcards.length}</span>
                    <span className="progress-score">Score: {score}/{currentIndex + (isSubmitted ? 1 : 0)}</span>
                </div>
            </div>

            {/* Quiz Card */}
            <div className="review-card">
                <div className="review-card-type">
                    {currentCard.cardType === 'qa' ? 'Q&A' : currentCard.cardType === 'single' ? 'Single Answer' : 'Multiple Answers'}
                </div>
                <h2 className="review-question">{currentCard.question}</h2>

                {/* Q&A Type */}
                {currentCard.cardType === 'qa' && (
                    <div className="qa-answer-section">
                        <input
                            className="form-input qa-input"
                            placeholder="Type your answer..."
                            value={qaAnswer}
                            onChange={(e) => setQaAnswer(e.target.value)}
                            disabled={isSubmitted}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !isSubmitted) handleSubmitAnswer(); }}
                        />
                        {isSubmitted && (
                            <div className={`qa-result ${qaAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase() ? 'correct' : 'wrong'}`}>
                                <span className="result-icon">
                                    {qaAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase() ? 'Correct' : 'Incorrect'}
                                </span>
                                <p className="correct-answer-text">
                                    Correct answer: <strong>{currentCard.answer}</strong>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* MCQ Type */}
                {(currentCard.cardType === 'single' || currentCard.cardType === 'multiple') && currentCard.options && (
                    <div className="review-options">
                        {currentCard.cardType === 'multiple' && !isSubmitted && (
                            <p className="mcq-hint">Select all correct answers</p>
                        )}
                        {currentCard.options.map((option, index) => (
                            <button
                                key={index}
                                className={getOptionClass(index)}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={isSubmitted}
                            >
                                <span className="option-letter-badge">{String.fromCharCode(65 + index)}</span>
                                <span className="option-text">{option}</span>

                            </button>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="review-actions">
                    {!isSubmitted ? (
                        <button
                            className="btn btn-primary review-submit-btn"
                            onClick={handleSubmitAnswer}
                            disabled={
                                (currentCard.cardType === 'qa' && !qaAnswer.trim()) ||
                                ((currentCard.cardType === 'single' || currentCard.cardType === 'multiple') && selectedAnswers.length === 0)
                            }
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button className="btn btn-primary review-next-btn" onClick={handleNext}>
                            {currentIndex < flashcards.length - 1 ? 'Next Question' : 'See Results'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
