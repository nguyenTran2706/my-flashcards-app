import React from 'react';
import Flashcard from './flashcard';

const FlashcardList = ({ flashcards, onDelete, onEdit }) => {
    return (
        <div className="card-grid-section">
            <div className="grid-header">
                <h2>Your Flashcards</h2>
                <span className="card-count">{flashcards.length} cards</span>
            </div>

            <div className="card-grid">
                {flashcards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <p>No flashcards yet</p>
                        <span className="empty-hint">Create your first flashcard above to start studying!</span>
                    </div>
                ) : (
                    flashcards.map(card => (
                        <Flashcard
                            key={card._id}
                            card={card}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FlashcardList;
