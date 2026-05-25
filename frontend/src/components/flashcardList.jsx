import React from 'react';
import Flashcard from './flashcard';

const FlashcardList = ({
    flashcards,
    totalCount,
    searchQuery,
    onSearchChange,
    onDelete,
    onEdit,
}) => {
    const isSearching = searchQuery && searchQuery.trim() !== '';
    const countLabel = isSearching
        ? `${flashcards.length} of ${totalCount} cards`
        : `${flashcards.length} cards`;

    return (
        <div className="card-grid-section">
            <div className="grid-header">
                <h2>Your Flashcards</h2>
                <span className="card-count">{countLabel}</span>
            </div>

            <div className="card-search">
                <input
                    className="form-input"
                    type="search"
                    placeholder="Search by question, answer, category, or option..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="card-grid">
                {flashcards.length === 0 ? (
                    isSearching ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <p>No cards match &ldquo;{searchQuery}&rdquo;</p>
                            <span className="empty-hint">
                                Try a different term, or clear the search to see all your cards.
                            </span>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <p>No flashcards yet</p>
                            <span className="empty-hint">
                                Create your first flashcard above to start studying!
                            </span>
                        </div>
                    )
                ) : (
                    flashcards.map((card) => (
                        <Flashcard key={card._id} card={card} onDelete={onDelete} onEdit={onEdit} />
                    ))
                )}
            </div>
        </div>
    );
};

export default FlashcardList;
