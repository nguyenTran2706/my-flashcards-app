// Base URL for your local backend server
const API_URL = 'http://localhost:5000/api/flashcards';

// READ: Fetch all flashcards
export const getFlashcards = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch flashcards');
    return response.json();
};

// CREATE: Add a new flashcard
export const createFlashcard = async (cardData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to create flashcard');
    return response.json();
};

// UPDATE: Edit an existing flashcard
export const updateFlashcard = async (id, cardData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to update flashcard');
    return response.json();
};

// DELETE: Remove a flashcard
export const deleteFlashcard = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete flashcard');
    return response.json();
};