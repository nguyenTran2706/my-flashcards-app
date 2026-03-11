import React, { useState } from 'react';

const FlashcardForm = ({ formData, editingId, onInputChange, onSubmit, onCancel }) => {
    return (
        <div className="card-form-section">
            <form onSubmit={onSubmit} className="card-form">
                <h2>{editingId ? 'Edit flashcard' : 'Add a new flashcard'}</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Question</label>
                        <input
                            className="form-input"
                            name="question"
                            placeholder="Question"
                            value={formData.question}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={onInputChange}
                        >
                            <option value="General">General</option>
                            <option value="Web Dev">Web Dev</option>
                            <option value="Database">Database</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="React">React</option>
                            <option value="Python">Python</option>
                        </select>
                    </div>
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Answer</label>
                    <input
                        className="form-input"
                        name="answer"
                            placeholder="Answer"
                        value={formData.answer}
                        onChange={onInputChange}
                        required
                    />
                </div>

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
