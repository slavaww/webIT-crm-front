import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import MDEditor from '@uiw/react-md-editor';
import apiClient from '../api/axiosConfig';
import { formatTaskDate } from '../utils/dateFormat';
import { minutesToHours } from '../utils/minutesToHours';
import LoadingLine from './LoadingLine';

const CommentItem = ({ comment }) => {
    const [spendTime, setSpendTime] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        apiClient.get(`/time_spends?comment=${comment.id}&total=1`)
            .then(response => {
                const totalMinutes = response.data['member'][0];
                if (totalMinutes > 0) {
                    setSpendTime(minutesToHours(totalMinutes));
                }
            })
            .catch(err => {
                console.error(`Не удалось загрузить время для комментария ${comment.id}`, err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [comment.id]);

    return (
        <ListGroup className="mb-3" key={comment.id}>
            <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="comment-author">
                        {formatTaskDate(comment.created_at)} - <strong>{comment.author?.name} {comment.author?.surname}</strong> ({comment.author?.employee?.job_title || comment.author?.client?.title})
                    </div>
                </div>
            </ListGroup.Item>
            <ListGroup.Item>
                <MDEditor.Markdown source={comment.description} />
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