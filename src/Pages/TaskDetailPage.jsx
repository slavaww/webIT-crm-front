import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { Button } from "react-bootstrap";
import EditSVG from "../Components/EditSVG";
import { isRole } from '../utils/isRole';
import CommentsAll from '../Components/CommentsAll';
import MDEditor from "@uiw/react-md-editor";

const TaskDetail = () => {
  const { id } = useParams(); // Получаем ID задачи из URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // null | 'title' | 'description' | 'worker'
  const [employees, setEmployees] = useState();

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

      if (isRole.superAdmin) {
        apiClient.get('/employees')
          .then(response => setEmployees(response.data['member'] || []))
          .catch(() => setError('Не удалось загрузить сотрудников!'));
      }
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

  const handleEditSave = async () => {
    try {
      let valueToPatch = task[activeModal];

      // Если мы редактируем связь (например, 'worker'), нам нужно отправить его IRI, а не весь объект.
      if (activeModal === 'worker' && typeof valueToPatch === 'object' && valueToPatch !== null) {
        valueToPatch = `/api/employees/${valueToPatch.id}`;
      }

      // Отправляем только измененные данные
      const dataToPatch = {
        [activeModal]: valueToPatch
      };
      
      await apiClient.patch(`/tasks/${id}`, dataToPatch, {
        headers: { 'Content-Type': 'application/merge-patch+json' }
      });

      setActiveModal(null); // Закрываем модальное окно после успешного сохранения

    } catch (err) {
      setError('Ошибка при обновлении задачи.');
    }
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
            <EditSVG
              context="title"
              taskData={task}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              onSave={handleEditSave}
              showModal={activeModal === 'title'}
              onHide={() => setActiveModal(null)}
              onShow={() => setActiveModal('title')}
            />
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
                {isRole.superAdmin && (
                  <EditSVG
                    context="worker"
                    taskData={task}
                    // onChange={(e) => setTask({ ...task, worker: e.target.value })}
                    onChange={(e) => {
                      const selectedWorkerIri = e.target.value;
                      const selectedEmployee = employees.find(emp => `/api/employees/${emp.id}` === selectedWorkerIri);
                      setTask({ ...task, worker: selectedEmployee || selectedWorkerIri });
                    }}
                    onSave={handleEditSave}
                    showModal={activeModal === 'worker'}
                    onHide={() => setActiveModal(null)}
                    onShow={() => setActiveModal('worker')}
                    employees={employees}
                  />
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
          <div className="task-detail__description d-flex justify-content-between align-items-start">
            <MDEditor.Markdown source={task.description} />
            <EditSVG
              color="#4E4F79"
              onHide={() => setActiveModal(null)}
              onShow={() => setActiveModal('description')}
              context="description"
              taskData={task}
              onChange={(value) => setTask({ ...task, description: value })}
              onSave={handleEditSave}
              showModal={activeModal === 'description'}
            />
          </div>
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
