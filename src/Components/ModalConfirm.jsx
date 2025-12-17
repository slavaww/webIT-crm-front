import { Button, Modal } from 'react-bootstrap';

const ModalConfirm = ({ show, onHide, onConfirm, message, title = 'Подтверждение', additionalMessage = '', confirmButtonText = 'Подтвердить', confirmButtonVariant = 'primary' }) => {
    
    const handleConfirm = () => {
        onConfirm();
        onHide(); // Закрываем модальное окно после подтверждения
    };

    return (
        <Modal show={show} onHide={onHide} onExited={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
                {additionalMessage && <p className="mt-2 text-muted small">{additionalMessage}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant={confirmButtonVariant} onClick={handleConfirm}>
                    {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalConfirm;