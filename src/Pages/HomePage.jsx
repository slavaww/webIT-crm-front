import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { getUserDataFromToken } from '../utils/authUtils';
import { Button } from 'react-bootstrap';
import TaskList from '../Components/TaskList';
import TaskFormModal from '../Components/TaskFormModal';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    // client: '',
    // status: '',
    // worker: '',
    // start_time: '',
    // end_time: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    // client: '',
    // status: '',
    // worker: '',
    // start_time: '',
    // end_time: '',
  });
  const [editTaskId, setEditTaskId] = useState(null);

  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);

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

  const handleCreateChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const handleCreateSave = async () => {
    try {
      const response = await apiClient.post('/tasks', newTask, { headers: { 'Content-Type': 'application/ld+json' } });
      setTasks([...tasks, response.data]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Ошибка при создании задачи.');
    }
  };

  const handleEdit = (task) => {
    setEditTask({
      title: task.title,
      description: task.description,
      client: task.client || '',
      status: task.status || '',
      worker: task.worker || '',
      // start_time: task.start_time || '',
      // end_time: task.end_time || '',
    });
    setEditTaskId(task.id);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => setEditTask({ ...editTask, [e.target.name]: e.target.value });

  const handleEditSave = async () => {
    try {
      // console.log(editTask);
      const response = await apiClient.patch(`/tasks/${editTaskId}`, editTask, { headers: { 'Content-Type': 'application/merge-patch+json' } });
      setTasks(tasks.map(t => t.id === editTaskId ? response.data : t));
      setShowEditModal(false);
    } catch (err) {
      setError('Ошибка при обновлении задачи.');
    }
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
    <div>
      <h2>Список задач</h2>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>Создать задачу</Button>
      <TaskList 
        tasks={tasks} 
        clients={clients} 
        statuses={statuses} 
        employees={employees} 
        isRole={isRole} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      <TaskFormModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
        taskData={newTask} 
        onChange={handleCreateChange} 
        onSave={handleCreateSave} 
        clients={clients} 
        statuses={statuses} 
        employees={employees} 
        isRole={isRole}
      />
      <TaskFormModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        taskData={editTask} 
        onChange={handleEditChange} 
        onSave={handleEditSave} 
        clients={clients} 
        statuses={statuses} 
        employees={employees}
        isRole={isRole}
      />
    </div>
  );
};

export default HomePage;
