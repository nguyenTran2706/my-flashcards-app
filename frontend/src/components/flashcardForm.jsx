import React from 'react';

const FlashcardForm = ({ formData, editingId, onInputChange, onSubmit, onCancel, onOptionChange, onAddOption, onRemoveOption, onCorrectAnswerChange }) => {
    const cardType = formData.cardType || 'qa';

    const getCardTypeLabel = (type) => {
        switch (type) {
            case 'qa': return 'Q&A';
            case 'single': return 'One Correct Answer';
            case 'multiple': return 'Multiple Answers';
            default: return 'Q&A';
        }
    };

    return (
        <div className="card-form-section">
            <form onSubmit={onSubmit} className="card-form">
                <h2>{editingId ? 'Edit flashcard' : 'Add a new flashcard'}</h2>

                {/* Card Type Selector */}
                <div className="card-type-selector">
                    <label className="form-label">Card Type</label>
                    <div className="type-pills">
                        {['qa', 'single', 'multiple'].map(type => (
                            <button
                                key={type}
                                type="button"
                                className={`type-pill ${cardType === type ? 'active' : ''}`}
                                onClick={() => onInputChange({ target: { name: 'cardType', value: type } })}
                            >
                                {getCardTypeLabel(type)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Input */}
                <div className="form-group full-width">
                    <label className="form-label">Question</label>
                    <input
                        className="form-input"
                        name="question"
                        placeholder="Enter your question..."
                        value={formData.question}
                        onChange={onInputChange}
                        required
                    />
                </div>

                {/* Q&A: Simple answer input */}
                {cardType === 'qa' && (
                    <div className="form-group full-width">
                        <label className="form-label">Answer</label>
                        <input
                            className="form-input"
                            name="answer"
                            placeholder="Enter the answer..."
                            value={formData.answer}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                )}

                {/* Single / Multiple: Options list */}
                {(cardType === 'single' || cardType === 'multiple') && (
                    <div className="options-section">
                        <label className="form-label">
                            Answer Options
                            <span className="label-hint">
                                {cardType === 'single' ? '— Select one correct answer' : '— Select all correct answers'}
                            </span>
                        </label>

                        <div className="options-list">
                            {(formData.options || []).map((option, index) => (
                                <div key={index} className="option-item">
                                    <div className="option-selector">
                                        {cardType === 'single' ? (
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                className="option-radio"
                                                checked={(formData.correctAnswers || []).includes(index)}
                                                onChange={() => onCorrectAnswerChange(index)}
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                className="option-checkbox"
                                                checked={(formData.correctAnswers || []).includes(index)}
                                                onChange={() => onCorrectAnswerChange(index)}
                                            />
                                        )}
                                    </div>
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    <input
                                        className="form-input option-input"
                                        placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                                        value={option}
                                        onChange={(e) => onOptionChange(index, e.target.value)}
                                    />
                                    {(formData.options || []).length > 2 && (
                                        <button
                                            type="button"
                                            className="option-remove-btn"
                                            onClick={() => onRemoveOption(index)}
                                            title="Remove option"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {(formData.options || []).length < 6 && (
                            <button type="button" className="add-option-btn" onClick={onAddOption}>
                                + Add Option
                            </button>
                        )}
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="btn-submit">
                        {editingId ? 'Save changes' : 'Save card'}
                    </button>
                    {editingId && (
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FlashcardForm;
