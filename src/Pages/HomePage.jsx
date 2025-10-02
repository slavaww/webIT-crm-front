/**
 * @todo /tasks?worker=2 не работает на бэкенде!!! здесь все работает!
 */
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { getUserDataFromToken } from '../utils/authUtils';
import TaskList from '../Components/TaskList';
import UserSVG from '../Components/UserSVG';
// import { Button } from 'react-bootstrap';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]); // Изначально пустой массив, что означает "все"
  const [startDateFilter, setStartDateFilter] = useState(''); // Фильтр по дате начала
  const [endDateFilter, setEndDateFilter] = useState('');   // Фильтр по дате окончания
  const [workerFilter, setWorkerFilter] = useState(''); // Фильтр по исполнителю

  const userData = getUserDataFromToken();
  const isRole = {
    client: userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    admin: userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    superAdmin: userData?.roles.includes('ROLE_SUPER_ADMIN'),
  };

  useEffect(() => {
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
  }, []); // Загружаем один раз при монтировании

  // Этот useEffect будет следить за всеми фильтрами и обновлять задачи
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (statusFilter.length > 0) {
      params.append('statuses', statusFilter.join(','));
    }
    if (startDateFilter) {
      params.append('create_start', startDateFilter);
    }
    if (endDateFilter) {
      params.append('create_end', endDateFilter);
    }
    if (workerFilter) {
      params.append('worker', workerFilter);
    }

    const queryString = params.toString();
    console.log(queryString);
    
    const apiUrl = `/tasks${queryString ? `?${queryString}` : ''}`;

    apiClient.get(apiUrl)
      .then(response => {
        setTasks(response.data['member'] || []);
      })
      .catch(err => setError('Не удалось загрузить список задач.'))
      .finally(() => setLoading(false));

  }, [statusFilter, startDateFilter, endDateFilter, workerFilter]); // Зависимости: все наши фильтры

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
      <div className="py-2 px-2 px-md-4 px-lg-5 d-lg-flex justify-content-between align-items-center task_list_header">
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
          <div className="d-none d-sm-block filter-block">
            <div className="filter-create">
              <div className="filter-create-wrap">
                <div className="filter-create-desc">Создана:</div>
                <div className="filter-create-inputs">
                  <label htmlFor="start-date" className={`form-label mb-0 filter-create-label${startDateFilter ? ' active' : ''}`}></label>
                  <input
                    type="date"
                    id="start-date"
                    className="form-control"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                  />
                  <label htmlFor="end-date" className={`form-label mb-0 ms-2 filter-create-label${endDateFilter ? ' active' : ''}`}></label>
                  <input
                    type="date"
                    id="end-date"
                    className="form-control"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="filter-worker">
              {(isRole.client) && (
                <div className="filter-worker-wrap">
                  <div className="filter-worker-label">Исполнитель:</div>
                  <div className="filter-worker-btns">
                    <button
                      className={`btn-switch users${workerFilter === 1 ? ' active' : ''}`}
                      key="1"
                      onClick={() => setWorkerFilter(1)}
                    >
                      <UserSVG type="1" />
                    </button>
                    <button
                      className={`btn-switch users${workerFilter === 2 ? ' active' : ''}`}
                      key="2"
                      onClick={() => setWorkerFilter(2)}
                    >
                      <UserSVG type="0" />
                    </button>
                    <button
                      className={`btn-switch users${workerFilter === '' ? ' active' : ''}`}
                      key="3"
                      onClick={() => setWorkerFilter("")}
                    >
                      <UserSVG type="all" />
                    </button>
                  </div>
                </div>
              )}
              {(isRole.superAdmin) && (
                <>
                  <label htmlFor="worker-filter" className="form-label mb-0">Исполнитель:</label>
                  <select
                    id="worker-filter"
                    className="form-select"
                    value={workerFilter}
                    onChange={(e) => setWorkerFilter(e.target.value)}
                  >
                    <option value="">Все</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.user_id.name} {employee.user_id.surname}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
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