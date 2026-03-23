import axios from 'axios';

// Base URL for your local backend server or production server
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/' : 'http://localhost:5000/api/');

// Helper to get auth header
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
};

// --- AUTHENTICATION ---

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}users/register`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}users/login`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};


// --- FLASHCARDS ---

export const getFlashcards = async () => {
    const response = await axios.get(`${API_URL}flashcards`, { headers: authHeader() });
    return response.data;
};

export const createFlashcard = async (cardData) => {
    const response = await axios.post(`${API_URL}flashcards`, cardData, { headers: authHeader() });
    return response.data;
};

export const updateFlashcard = async (id, cardData) => {
    const response = await axios.put(`${API_URL}flashcards/${id}`, cardData, { headers: authHeader() });
    return response.data;
};

export const deleteFlashcard = async (id) => {
    const response = await axios.delete(`${API_URL}flashcards/${id}`, { headers: authHeader() });
    return response.data;
};