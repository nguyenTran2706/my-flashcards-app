import React, { useState } from 'react';
import '../App.css';

const Flashcard = ({ card, onDelete, onEdit }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const getTypeLabel = (type) => {
        switch (type) {
            case 'single': return 'SINGLE ANSWER';
            case 'multiple': return 'MULTIPLE ANSWERS';
            default: return 'Q&A';
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'single': return 'type-single';
            case 'multiple': return 'type-multiple';
            default: return 'type-qa';
        }
    };

    return (
        <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>

                <div className="flashcard-front">
                    <span className={`card-category ${getTypeClass(card.cardType)}`}>
                        {getTypeLabel(card.cardType)}
                    </span>
                    <h3 className="card-question">{card.question}</h3>
                    <span className="card-hint">Click card to see the answer</span>

                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="card-action-btn" onClick={() => onEdit(card)} title="Edit">
                            Edit
                        </button>
                        <button className="card-action-btn delete" onClick={() => onDelete(card._id)} title="Delete">
                            Delete
                        </button>
                    </div>
                </div>

                <div className="flashcard-back">
                    {(card.cardType === 'single' || card.cardType === 'multiple') && card.options && card.options.length > 0 ? (
                        <div className="back-options">
                            <span className="card-answer-label">
                                {card.cardType === 'single' ? 'Correct Answer' : 'Correct Answers'}
                            </span>
                            <div className="back-options-list">
                                {card.options.map((opt, i) => (
                                    <div
                                        key={i}
                                        className={`back-option ${(card.correctAnswers || []).includes(i) ? 'correct' : ''}`}
                                    >
                                        <span className="back-option-letter">{String.fromCharCode(65 + i)}</span>
                                        <span className="back-option-text">{opt}</span>
                                        {(card.correctAnswers || []).includes(i) && (
                                            <span className="correct-badge">✓</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="card-answer-label">Answer</span>
                            <p className="card-answer">{card.answer}</p>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Flashcard;