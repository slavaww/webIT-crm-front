import { useEffect } from 'react';
import { Alert, CloseButton } from 'react-bootstrap';

const AutoDismissAlert = ({ message, type, onDismiss, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onDismiss]);

    if (!message) return null;

    return (
        <Alert variant={type} onClose={onDismiss} dismissible>
            {message}
            <CloseButton 
                onClick={onDismiss}
                aria-label="Закрыть"
            />
        </Alert>
        // <div className={`alert alert-${type} alert-dismissible fade show`}>
        // </div>
    );
};

export default AutoDismissAlert;