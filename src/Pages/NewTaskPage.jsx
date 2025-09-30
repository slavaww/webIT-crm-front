import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; // Импортируем декодер
import { Navigate } from 'react-router-dom';
import TaskFormModal from '../Components/TaskFormModal';
import { Button } from 'react-bootstrap';
import { getUserDataFromToken } from '../utils/authUtils';

const NewTaskPage = () => {
    const token = localStorage.getItem('authToken');

    //-->
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const userData = getUserDataFromToken();
    const isRole = {
        client: userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
        admin: userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
        superAdmin: userData?.roles.includes('ROLE_SUPER_ADMIN'),
    };

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

    //-->

    if (!token) {
        // Если токена нет, перенаправляем на страницу входа
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="cont">
            <h2 className="header">Страница создания новой задачи</h2>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Создать задачу</Button>
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

export default NewTaskPage;