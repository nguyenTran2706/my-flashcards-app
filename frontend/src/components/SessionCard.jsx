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

// One review session row. Used by /history (owner: can delete + edit notes) and by
// /admin/users/:id (read-only). Passing onSaveNotes/onDelete enables those actions.
const SessionCard = ({ session, onDelete, onSaveNotes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingNotes, setEditingNotes] = useState(false);
    const [draft, setDraft] = useState(session.notes || '');
    const [saving, setSaving] = useState(false);

    const canEditNotes = Boolean(onSaveNotes);

    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            await onSaveNotes(session._id, draft.trim());
            setEditingNotes(false);
        } finally {
            setSaving(false);
        }
    };

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

            {/* Notes: editable for the owner, read-only for admins */}
            {canEditNotes ? (
                <div className="history-notes">
                    {editingNotes ? (
                        <>
                            <textarea
                                className="form-input"
                                rows={2}
                                placeholder="Add a note about this session…"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                            />
                            <div className="history-notes-actions">
                                <button
                                    className="btn btn-primary btn-small"
                                    onClick={handleSaveNotes}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving…' : 'Save note'}
                                </button>
                                <button
                                    className="btn btn-secondary btn-small"
                                    onClick={() => {
                                        setDraft(session.notes || '');
                                        setEditingNotes(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="history-notes-view">
                            <span className="history-notes-text">
                                {session.notes ? session.notes : 'No note yet.'}
                            </span>
                            <button
                                className="btn btn-secondary btn-small"
                                onClick={() => setEditingNotes(true)}
                            >
                                {session.notes ? 'Edit note' : 'Add note'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                session.notes && (
                    <div className="history-notes">
                        <span className="history-notes-text">{session.notes}</span>
                    </div>
                )
            )}

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
