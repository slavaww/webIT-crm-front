import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { getUserDataFromToken } from '../utils/authUtils';
import { Modal, Button, Form } from 'react-bootstrap';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Для создания задачи
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  });

  // Для редактирования задачи
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
  });

  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Получаем роль текущего пользователя
  const userData = getUserDataFromToken();
  const isClient = userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN');
  const isSuperAdmin = userData?.roles.includes('ROLE_SUPER_ADMIN');

  useEffect(() => {
    apiClient.get('/tasks')
      .then(response => {
        setTasks(response.data['member'] || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Не удалось загрузить список задач.');
        setLoading(false);
      });

    // Загрузка статусов (для всех)
    apiClient.get('/statuses')
      .then(response => setStatuses(response.data['member'] || []))
      .catch(() => setError('Не удалось загрузить статусы.'));

    // Загрузка клиентов (для ROLE_ADMIN и ROLE_SUPER_ADMIN)
    if (isAdmin || isSuperAdmin) {
      apiClient.get('/clients')
        .then(response => setClients(response.data['member'] || []))
        .catch(() => setError('Не удалось загрузить клиентов.'));
    }

    // Загрузка сотрудников (для ROLE_SUPER_ADMIN)
    if (isSuperAdmin || isClient) {
      apiClient.get('/employees')
        .then(response => {
          setEmployees(response.data['member'] || []);
        })
        .catch(() => setError('Не удалось загрузить сотрудников!'));
    }
  }, [isClient, isAdmin, isSuperAdmin]);

  const handleChangeNewTask = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const response = await apiClient.post('/tasks', newTask, {
        headers: { 'Content-Type': 'application/ld+json' }
      });
      setTasks([...tasks, response.data]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Ошибка при создании задачи.');
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTask({
        title: task.title,
        description: task.description,
        // Другие поля
    });
    setShowEditModal(true);
  };

  const handleChangeEditTask = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = async () => {
    try {
      const response = await apiClient.patch(`/tasks/${editTaskId}`, editTask, {
        headers: { 'Content-Type': 'application/merge-patch+json' }
      });
      setTasks(tasks.map(t => t.id === editTaskId ? response.data : t));
      setShowEditModal(false);
    } catch (err) {
      setError('Ошибка при обновлении задачи.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await apiClient.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        setError('Ошибка при удалении задачи.');
      }
    }
  };
  
  if (loading) return <div>Загрузка задач...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Список задач</h2>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>Создать задачу</Button>
      {
        tasks.length === 0 ? (
          <div className="mt-3 mt-md-4 mt-lg-5 alert alert-danger">
            Нет задач для отображения.
          </div>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                {(isAdmin || isSuperAdmin) && (
                  <th>Клиент</th>
                )}
                <th>Название</th>
                <th>Описание</th>
                <th>Дата создания</th>
                <th>Статус</th>
                {(isClient || isSuperAdmin) && (
                  <th>Исполнитель</th>
                )}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                   {(isAdmin || isSuperAdmin) && (
                    <td>{clients.find(s => s["@id"] === task.client)?.title || 'Внутренняя задача'}</td>
                  )}
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{new Date(task.create_date).toLocaleDateString()}</td>
                  <td>{statuses.find(s => s["@id"] === task.status)?.status || 'Не указан'}</td>
                  {(isClient || isSuperAdmin) && (
                    <td>
                      {(() => {
                        const employee = employees.find(s => s["@id"] === task.worker);
                        if (!employee?.user_id) return 'Не назначен';
                        return `${employee.user_id.name} ${employee.user_id.surname}`;
                      })()}
                    </td>
                  )}

                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleEditTask(task)}>Редактировать</Button>
                    <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDeleteTask(task.id)}>Удалить</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      {/* Модальное окно для создания задачи */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать новую задачу</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control type="text" name="title" value={newTask.title} onChange={handleChangeNewTask} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" name="description" value={newTask.description} onChange={handleChangeNewTask} rows={3} />
            </Form.Group>

            {/* Выбор клиента (только для ROLE_ADMIN и ROLE_SUPER_ADMIN) */}
            {(isAdmin || isSuperAdmin) && (
              <Form.Group className="mb-3">
                <Form.Label>Клиент</Form.Label>
                <Form.Select name="client" value={newTask.client} onChange={handleChangeNewTask} required>
                  <option value="">Выберите клиента</option>
                  {clients.map(client => (
                    <option key={client.id} value={`/api/clients/${client.id}`}>{client.title}</option> // IRI формат для API Platform
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {/* Выбор статуса (для всех, по умолчанию "Создана") */}
            {(isAdmin || isSuperAdmin) && (
              <Form.Group className="mb-3">
                <Form.Label>Статус</Form.Label>
                <Form.Select name="status" value={newTask.status} onChange={handleChangeNewTask} required>
                  <option value="">Выберите статус</option>
                  {statuses.map(status => (
                    <option key={status.id} value={`/api/statuses/${status.id}`}>{status.status}</option> // IRI
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {/* Выбор исполнителя (worker) */}
            {(isSuperAdmin) && (
            <Form.Group className="mb-3">
              <Form.Label>Исполнитель</Form.Label>
              <Form.Select name="worker" value={newTask.worker} onChange={handleChangeNewTask} required={isAdmin}>
                <option value="">Выберите исполнителя</option>
                {employees.map(employee => (
                  <option key={employee.id} value={`/api/employees/${employee.id}`}>{employee.user_id.name} {employee.user_id.surname}</option> // IRI
                ))}
              </Form.Select>
            </Form.Group>
            )}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Закрыть</Button>
          <Button variant="primary" onClick={handleCreateTask}>Создать</Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно для редактирования задачи */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать задачу</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control type="text" name="title" value={editTask.title} onChange={handleChangeEditTask} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" name="description" value={editTask.description} onChange={handleChangeEditTask} rows={3} />
            </Form.Group>
            {/* Добавлять тут другие поля по мере продвижения */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Закрыть</Button>
          <Button variant="primary" onClick={handleUpdateTask}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;
