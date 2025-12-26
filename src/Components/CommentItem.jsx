import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import MDEditor from '@uiw/react-md-editor';
import apiClient from '../api/axiosConfig';
import { formatTaskDate } from '../utils/dateFormat';
import { minutesToHours } from '../utils/minutesToHours';
import LoadingLine from './LoadingLine';
import EditSVG from "./EditSVG";
import { isRole } from '../utils/isRole';
import { getUserDataFromToken } from '../utils/authUtils';
import { confirmModal } from '../services/modalService';
import SetTimeSpend from './SetTimeSpend';

const CommentItem = ({ comment, onCommentDeleted, onTimeUpdated }) => {
    const [spendTime, setSpendTime] = useState(null);
    const [currentComment, setCurrentComment] = useState(comment);
    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [error, setError] = useState(null);

    const getIdFromIri = (iri) => {
        const match = iri.match(/\d+$/);
        return match ? parseInt(match[0], 10) : null;
    };

    const currentUser = getUserDataFromToken();
    const isAuthor = () => {
        if (isRole.superAdmin) {
            return true;
        }
        if (isRole.admin) {
            const empIri = comment.author?.employee ? comment.author?.employee['@id'] : '';
            return currentUser.employeeId === getIdFromIri(empIri);
        }
        if (isRole.client) {
            const clientIri = comment.author?.client ? comment.author?.client['@id'] : '';
            return currentUser.clientId === getIdFromIri(clientIri);
        }
    };

    const fetchSpendTime = () => {
        setLoading(true);
        apiClient.get(`/time_spends?comment=${comment.id}&total=1`)
            .then(response => {
                const totalMinutes = response.data['member'][0];
                // Сбрасываем время, если оно равно 0, чтобы не отображать "0 ч. 0 мин."
                if (totalMinutes > 0) {
                    setSpendTime(minutesToHours(totalMinutes));
                } else {
                    setSpendTime(null);
                }
            })
            .catch(err => {
                console.error(`Не удалось загрузить время для комментария ${comment.id}`, err);
                setSpendTime(null); // Сбрасываем в случае ошибки
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Новый обработчик, который будет передан в SetTimeSpend
    // Он обновит время комментария и вызовет обновление общего времени
    const handleTimeSaved = () => {
        // 1. Вызываем колбэк, который пришел "сверху", чтобы обновить общее время
        if (onTimeUpdated) {
            onTimeUpdated();
        }
        // 2. Запускаем обновление времени для текущего комментария
        fetchSpendTime();
    };

    const handleEditSave = async () => {
        try {
            const dataToPatch = {
                description: currentComment.description
            };

            const response = await apiClient.patch(`/comments/${currentComment.id}`, dataToPatch, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            // Обновляем локальное состояние свежими данными с сервера
            setCurrentComment(response.data);
            setActiveModal(null);

        } catch (err) {
            setError('Ошибка при обновлении комментария.');
        }
    };

    const handleDeleteComment = async () => {
        const isConfirmed = await confirmModal({
              title: "Подтвердите удаление",
              message: "Вы уверены, что хотите удалить этот комментарий?",
              additionalMessage: "Это действие необратимо. Комментарий с отметкой времени удалить нельзя.",
              confirmButtonVariant: "danger",
              confirmButtonText: "Удалить"
        });
        if (isConfirmed) {
            apiClient.delete(`/comments/${comment.id}`)
                .then(() => {
                    if (onCommentDeleted) {
                        onCommentDeleted(comment.id);
                    }
                })
                .catch(err => {
                    console.error(`Не удалось удалить комментарий ${comment.id}`, err);
            });
        }
    };

    useEffect(() => {
        fetchSpendTime();
    }, [comment.id]); // Зависимость только от ID комментария

    if (!currentComment) return null;

    return (
        <ListGroup className="mb-3" key={comment.id}>
            <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="comment-author">
                        {formatTaskDate(comment.created_at)} - <strong>{comment.author?.name} {comment.author?.surname}</strong> ({comment.author?.employee?.job_title || comment.author?.client?.title})
                    </div>
                    {isAuthor() && (
                        <div className='ms-1'>
                            <SetTimeSpend commentId={comment.id} onTimeSaved={handleTimeSaved} />
                            <EditSVG
                                color="#4E4F79"
                                context="description"
                                taskData={currentComment}
                                onChange={(value) => setCurrentComment({ ...currentComment, description: value })}
                                onSave={handleEditSave}
                                showModal={activeModal === 'comment'}
                                onHide={() => setActiveModal(null)}
                                onShow={() => setActiveModal('comment')}
                                dataTooltip="Редактировать"
                                dataPlacement="top"
                            />
                            <Button
                                variant="danger"
                                className='ms-2'
                                onClick={handleDeleteComment}
                                data-tooltip="Удалить"
                                data-placement="top"
                            >
                                <i className="bi bi-trash3"></i>
                            </Button>
                        </div>
                    )}
                </div>
            </ListGroup.Item>
            <ListGroup.Item>
                <MDEditor.Markdown source={currentComment.description} />
            </ListGroup.Item>
            {loading  && <ListGroup.Item><LoadingLine /></ListGroup.Item>}
            {spendTime &&
                <ListGroup.Item>
                    <span className='fs-6 fw-lighter'>Затраченное время: </span>{spendTime.hours ? spendTime.hours + ' ч. ' : ''}{spendTime.minutes ? spendTime.minutes + ' мин.' : ''}
                </ListGroup.Item>
            }
        </ListGroup>
    );
};

export default CommentItem;