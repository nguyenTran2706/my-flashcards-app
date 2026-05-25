import React, { useState } from 'react';

const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// One review session row. Used by /history (with delete) and by /admin/users/:id (read-only).
const SessionCard = ({ session, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li className="history-item">
            <div className="history-row">
                <div className="history-meta">
                    <span className="history-date">{formatDate(session.completedAt)}</span>
                    <span className="history-score">
                        {session.correctCount}/{session.totalCards} ({session.scorePercent}%)
                    </span>
                </div>
                <div className="history-actions">
                    <button
                        className="btn btn-secondary btn-small"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? 'Hide answers' : 'View answers'}
                    </button>
                    {onDelete && (
                        <button
                            className="btn btn-danger btn-small"
                            onClick={() => onDelete(session._id)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <ol className="history-answers">
                    {(session.answers || []).map((a, idx) => (
                        <li
                            key={idx}
                            className={`history-answer ${a.isCorrect ? 'correct' : 'wrong'}`}
                        >
                            <div className="history-answer-q">
                                Q{idx + 1}. {a.question}
                            </div>
                            <div className="history-answer-row">
                                <span className="label">Your answer:</span>
                                <span>{a.userAnswer || '(no answer)'}</span>
                            </div>
                            {!a.isCorrect && (
                                <div className="history-answer-row">
                                    <span className="label">Correct:</span>
                                    <span>{a.correctAnswer}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </li>
    );
};

export default SessionCard;
