import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import apiClient from '../api/axiosConfig';
import { isRole } from '../utils/isRole';
import TaskList from '../Components/TaskList';
import FilterWorker from '../Components/FilterWorker';
import FilterCreate from '../Components/FilterCreate';
import FilterStatuses from '../Components/FilterStatuses';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(true);
  const [isClosed, setIsClosed] = useState(true);

  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]); // Изначально пустой массив, что означает "все"
  const [startDateFilter, setStartDateFilter] = useState(''); // Фильтр по дате начала
  const [endDateFilter, setEndDateFilter] = useState('');   // Фильтр по дате окончания
  const [workerFilter, setWorkerFilter] = useState(''); // Фильтр по исполнителю
  const [clientFilter, setClientFilter] = useState(''); // Фильтр по исполнителю

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
    if (clientFilter) {
      params.append('client', clientFilter);
    }
    if (!inProgress) {
      params.append('inProgress', "all");
    }
    if (!isClosed) {
      params.append('inProgress', "1");
    }

    const queryString = params.toString();
    
    const apiUrl = `/tasks${queryString ? `?${queryString}` : ''}`;

    apiClient.get(apiUrl)
      .then(response => {
        setTasks(response.data['member'] || []);
      })
      .catch(err => setError('Не удалось загрузить список задач.'))
      .finally(() => setLoading(false));

  }, [statusFilter, startDateFilter, endDateFilter, workerFilter, clientFilter, inProgress, isClosed]); // Зависимости: все наши фильтры

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
          <div className="align-self-end">
            <Form.Check
              type="switch"
              id="in-progress-switch"
              label="Действующие"
              checked={inProgress}
              onChange={() => {setInProgress(inProgress ? false : true); setIsClosed(true)}}
            />
            {!inProgress && (
              <Form.Check
                type="switch"
                id="in-progress-switch"
                label="Закрытые задачи"
                checked={!isClosed}
                onChange={() => setIsClosed(isClosed ? false : true)}
              />
            )}
          </div>

          <FilterStatuses
            statuses={statuses}
            statusFilter={statusFilter}
            handleFilter={handleFilter}
          />

          <div className="d-none d-sm-flex filter-block">
            <FilterCreate
              startDateFilter={startDateFilter}
              endDateFilter={endDateFilter}
              setStartDateFilter={setStartDateFilter}
              setEndDateFilter={setEndDateFilter}
            />

            <FilterWorker
              isRole={isRole}
              employees={employees}
              workerFilter={workerFilter}
              setWorkerFilter={setWorkerFilter}
              clients={clients}
              clientFilter={clientFilter}
              setClientFilter={setClientFilter}
            />
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
        inProgress={inProgress}
      />
    </div>
  );
};

export default HomePage;