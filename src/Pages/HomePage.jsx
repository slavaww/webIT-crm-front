import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { getUserDataFromToken } from '../utils/authUtils';
import TaskList from '../Components/TaskList';
// import { Button } from 'react-bootstrap';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]); // Изначально пустой массив, что означает "все"

  const userData = getUserDataFromToken();
  const isRole = {
    client: userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    admin: userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    superAdmin: userData?.roles.includes('ROLE_SUPER_ADMIN'),
  };

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

    apiClient.get('/statuses')
      .then(response => setStatuses(response.data['member'] || []))
      .catch(() => setError('Не удалось загрузить статусы.'));

    if (isRole.admin || isRole.superAdmin) {
      apiClient.get('/clients')
        .then(response => setClients(response.data['member'] || []))
        .catch(() => setError('Не удалось загрузить клиентов.'));
    }

    if (isRole.superAdmin || isRole.client) {
      apiClient.get('/employees')
        .then(response => setEmployees(response.data['member'] || []))
        .catch(() => setError('Не удалось загрузить сотрудников!'));
    }
  }, [isRole.client, isRole.admin, isRole.superAdmin]);

  const handleFilter = (clickedStatusId) => {
    let newFilter;

    if (clickedStatusId === 'all') {
      newFilter = []; // Если нажата кнопка "Все", очищаем все фильтры
    } else {
      // Проверяем, есть ли уже этот статус в фильтре
      if (statusFilter.includes(clickedStatusId)) {
        // Если есть, удаляем его (отключаем фильтр)
        newFilter = statusFilter.filter(s => s !== clickedStatusId);
      } else {
        // Если нет, добавляем его (включаем фильтр)
        newFilter = [...statusFilter, clickedStatusId];
      }
    }

    setStatusFilter(newFilter); // Обновляем состояние фильтра

    // Формируем URL для запроса задач
    let apiUrl = '/tasks';
    if (newFilter.length > 0) {
      // Если есть выбранные статусы, добавляем их в параметры
      apiUrl += `?statuses=${newFilter.join(',')}`;
    }

    apiClient.get(apiUrl)
      .then(response => setTasks(response.data['member'] || []))
      .catch(err => setError('Не удалось загрузить список задач.'));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        await apiClient.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        setError('Ошибка при удалении задачи.');
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className='task-list'>
      <div className="py-2 px-2 px-md-4 px-lg-5 d-flex justify-content-between align-items-center task_list_header">
        <h2>Задачи</h2>
        <div className="task-list-filter">
          <div className="filter-statuses">
            <div className='list-unstyled filter-statuses-list'>
              {/* Кнопки статусов */}
              {statuses.map(status => (
                <button
                  className={`btn-switch${statusFilter.includes(status.id) ? ' active' : ''}`}
                  id={status.id}
                  key={status.id}
                  onClick={() => handleFilter(status.id)}
                >
                  {status.status}
                </button>
              ))}
              <button className={`btn-switch${statusFilter.length === 0 ? ' active' : ''}`} onClick={() => handleFilter('all')}>Все</button>
            </div>
          </div>
          <div className="filter-block">
            <div className="filter-create">create task</div>
            <div className="filter-worker">Worker</div>
          </div>
        </div>
      </div>
      <TaskList 
        tasks={tasks} 
        clients={clients} 
        statuses={statuses} 
        employees={employees} 
        isRole={isRole} 
        // onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default HomePage;