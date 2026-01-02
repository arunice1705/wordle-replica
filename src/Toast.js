import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, onClose, duration = 2000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className="toast-container">
            <div className="toast-message">
                {message}
            </div>
        </div>
    );
};

export default Toast;
