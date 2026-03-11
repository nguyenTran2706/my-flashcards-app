import React, { useState } from 'react';
import '../App.css';

const Flashcard = ({ card, onDelete, onEdit }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>

                {/* FRONT — Question */}
                <div className="flashcard-front">
                    <span className="card-category">{card.category}</span>
                    <h3 className="card-question">{card.question}</h3>
                    <span className="card-hint">Click to reveal answer</span>

                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="card-action-btn" onClick={() => onEdit(card)} title="Edit">
                            ✏️
                        </button>
                        <button className="card-action-btn delete" onClick={() => onDelete(card._id)} title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>

                {/* BACK — Answer */}
                <div className="flashcard-back">
                    <span className="card-answer-label">Answer</span>
                    <p className="card-answer">{card.answer}</p>
                </div>

            </div>
        </div>
    );
};

export default Flashcard;