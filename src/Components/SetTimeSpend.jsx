import React, { useEffect, useState } from 'react';
import { Button, Modal, Form} from 'react-bootstrap';
import apiClient from '../api/axiosConfig';

const SetTimeSpend = ({ commentId, onTimeSaved, dataTooltip = 'Затраченное время', dataPlacement = 'top', spendTime = null }) => {
    const [showModal, setShowModal] = useState(false);
    const [time, setTime] = useState('00:00');
    const [error, setError] = useState('');
    const [isHasSpendTime, setIsHasSpendTime] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setError(''); // Сбрасываем ошибку при закрытии
        // setTime('00:00'); // Сбрасываем время
    };

    useEffect(() => {
        if (spendTime) {
            const hours = spendTime.hours.toString().padStart(2, '0');
            const minutes = spendTime.minutes.toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
            setIsHasSpendTime(true);
        }
    }, [spendTime]);

    const handleSave = async () => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes <= 0) {
            setError('Время должно быть больше нуля.');
            return;
        }
            
        try {
            if (isHasSpendTime) {
                const response = await apiClient.patch(`/time_spends/${spendTime.id}`, 
                    { time_spend: totalMinutes },
                    { headers: { "Content-Type": "application/merge-patch+json" } }
                );

            } else {
                const response = await apiClient.post('/time_spends', {
                    comment: `/api/comments/${commentId}`,
                    time_spend: totalMinutes
                },
                { headers: { "Content-Type": "application/ld+json" } }
                );
            }
            handleClose();
            // Вызываем колбэк после успешного сохранения
            if (onTimeSaved) {
                onTimeSaved();
            }
        } catch (err) {
            setError('Не удалось сохранить время. ' + (err.response?.data?.detail || 'Попробуйте снова.'));
            console.error('Ошибка сохранения времени:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/time_spends/${spendTime.id}`);
            handleClose();
            if (onTimeSaved) {
                onTimeSaved();
            }
        } catch (err) {
            setError('Не удалось удалить время. ' + (err.response?.data?.detail || 'Попробуйте снова.'));
            console.error('Ошибка удаления времени:', err);
        }
    };

    return (
        <>
            <Button onClick={handleShow} variant="dark" data-tooltip={dataTooltip} data-placement={dataPlacement}>
                <i className="bi bi-stopwatch"></i>
            </Button>
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Указать затраченное время</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="time-spend">
                            <Form.Label>Время в формате ЧЧ:ММ</Form.Label>
                            <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                            {error && <Form.Text className="text-danger">{error}</Form.Text>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete} className='me-auto'>Удалить</Button>
                    <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
                    <Button variant="primary" onClick={handleSave}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SetTimeSpend;