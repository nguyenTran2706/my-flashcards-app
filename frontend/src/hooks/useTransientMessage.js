import { useState, useEffect } from 'react';

// A success/info message that clears itself after `delay` ms, so banners read
// like toasts. Replaces the copy-pasted auto-clear effect across pages.
export const useTransientMessage = (delay = 3000) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(''), delay);
        return () => clearTimeout(timer);
    }, [message, delay]);

    return [message, setMessage];
};
