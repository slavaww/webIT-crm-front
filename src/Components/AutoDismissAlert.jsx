import { useEffect } from 'react';

const AutoDismissAlert = ({ message, type, onDismiss, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onDismiss]);

    if (!message) return null;

    return (
        <div className={`alert alert-${type} alert-dismissible fade show`}>
            {message}
            <button 
                type="button" 
                className="btn-close" 
                onClick={onDismiss}
                aria-label="Закрыть"
            ></button>
        </div>
    );
};

export default AutoDismissAlert;