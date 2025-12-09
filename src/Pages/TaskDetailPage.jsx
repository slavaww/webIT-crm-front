import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { Button } from "react-bootstrap";
import EditSVG from "../Components/EditSVG";
import { isRole } from '../utils/isRole';
import CommentsAll from '../Components/CommentsAll';

const TaskDetail = () => {
  const { id } = useParams(); // Получаем ID задачи из URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загрузка детальной задачи
    apiClient
      .get(`/tasks/${id}`)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Не удалось загрузить задачу.");
        setLoading(false);
      });
  }, [id]);

  const getStatusId = () => {
    if (task.status) {
      return (task.status["@id"].replace("/api/statuses/", "") );
    }
  }

  const classColorTaskEnd = () => {
    if (!task.end_time) {
      return ' task-detail__frame--at-work';
    }

    return '';
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return <div>Задача не найдена.</div>;

  return (
    <div className="container-flex mt-4 mx-4 task-detail">
      <div className="row">
        <div className="col-9">
          <div className="task-detail__header d-flex justify-content-between align-items-center">
            <h2>{task.title}</h2>
            <EditSVG />
          </div>
        </div>
        <div className="col-3">
          <div className="task-detail__frame--def d-flex justify-content-between align-items-center">
            {(isRole.client || isRole.superAdmin) && (
              <>
                <div className="task-detail__worker">
                  <div className="task-detail__label">Исполнитель:</div>
                  {task.worker?.user_id?.name && (
                    <div className="task-detail__main-field">
                      {task.worker?.user_id?.name} {task.worker?.user_id?.surname}
                    </div>
                  )}
                  {!task.worker?.user_id?.name && (
                    <div className="task-detail__no-worker">Не назначен</div>
                  )}
                  {task.worker?.job_title && (
                    <div className="task-detail__sub-field">
                      {task.worker?.job_title}
                    </div>
                  )}
                </div>
                {isRole.admin && (
                  <EditSVG />
                )}
              </>
            )}
            {isRole.admin && (
              <>
                <div className="task-detail__label">Клиент:</div>
                <div className="task-detail__main-field">{task.client?.title}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-9">
          <div className="task-detail__description d-flex justify-content-between">{task.description}<EditSVG /></div>
        </div>
        <div className="col-3">
          <div className="d-flex flex-column h-100">
            <div className="task-detail__frame--def mb-4">
              <div className="task-detail__label">Создана:</div>
              <div className="task-detail__main-field">
                {new Date(task.create_date).toLocaleDateString()}
              </div>
              <div className="task-detail__sub-field">
                {task.creator?.name}{" "}{task.creator?.surname}
              </div>
            </div>
            <div className={`task-detail__frame--def mb-4${classColorTaskEnd()}`}>
              {task.start_time && task.end_time && (
                <div className="task-detail__label">Начата:{" "}{new Date(task.start_time).toLocaleString()}</div>
              )}
              {task.end_time && (
                <div className="task-detail__main-field">Дата окончания: <strong>{new Date(task.end_time).toLocaleString()}</strong></div>
              )}
              {!task.end_time && (
                <div className="d-flex justify-content-between align-items-center">
                  <div className="task-detail__main-field">В работе</div>
                  <Button
                    variant="danger"
                  >Завершить</Button>
                </div>
              )}
            </div>
            <div className="task-detail__frame--def mb-4">Время:</div>
            <div className="task-detail__frame--def mt-auto"><strong>Статус:</strong> <span className={`status-field status-${getStatusId()}`}>{task.status?.status}</span></div>
          </div>
        </div>
      </div>

      <CommentsAll id={id} />
    </div>
  );
};

export default TaskDetail;
