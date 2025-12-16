import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import MDEditor from "@uiw/react-md-editor";
import ImageUploadButton from "../Components/ImageUploadButton";
import { useImageUpload } from "../hooks/useImageUpload";
import { getUserDataFromToken } from '../utils/authUtils';
import apiClient from "../api/axiosConfig"

const NewTaskPage = () => {
    const token = localStorage.getItem('authToken');
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const userData = getUserDataFromToken();
    const isRole = {
        client: userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
        admin: userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
        superAdmin: userData?.roles.includes('ROLE_SUPER_ADMIN'),
    };
    const { uploadImage, isUploading, uploadError } = useImageUpload();
    const navigate = useNavigate();

    const [newTask, setNewTask] = useState({
        // title: '',
        // description: '',
        // client: '',
        // status: '',
        // worker: '',
    });

    useEffect(() => {
        // Загрузка клиентов для админов
        if (isRole.admin || isRole.superAdmin) {
            apiClient.get('/statuses')
                .then(response => setStatuses(response.data['member'] || []))
                .catch(() => console.error('Не удалось загрузить статусы.'));

            apiClient.get('/clients')
                .then(response => setClients(response.data['member'] || []))
                .catch(() => console.error('Не удалось загрузить клиентов.'));
        }

        // Загрузка сотрудников для суперадмина
        if (isRole.superAdmin) {
            apiClient.get('/employees')
                .then(response => setEmployees(response.data['member'] || []))
                .catch(() => console.error('Не удалось загрузить сотрудников!'));
        }
    }, [isRole.admin, isRole.superAdmin]);

    const handleCreateSave = async () => {
        try {
            const response = await 
                apiClient.post('/tasks',
                    newTask,
                    { headers: { 'Content-Type': 'application/ld+json' } }
                );
            navigate('/');
        } catch (err) {
            console.log('Ошибка при создании задачи.', err);
        }
    };

    if (!token) {
        // Если токена нет, перенаправляем на страницу входа
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container-fluid pt-4 px-4">
            <h2 className="header">Новая задача</h2>
            <Form>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={newTask.title || ''}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                    <Form.Text className="text-muted">
                        Емкое название задачи, отражающее её суть. Обязательное поле.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Описание</Form.Label>
                    <MDEditor
                        name="description"
                        value={newTask.description || ''}
                        onChange={(e) => setNewTask({ ...newTask, description: e })}
                        height={200}
                        preview={isUploading ? "preview" : "edit"}
                    />
                    <div className="mt-2">
                        <ImageUploadButton
                            size="md"
                            variant="outline-light"
                            onImageUpload={uploadImage}
                            onInsert={(markdown) => setNewTask(prev => ({ ...prev, description: (prev.description || '') + '\n' + markdown }))}
                        />
                    </div>
                </Form.Group>

                {/* Выбор клиента (только для ROLE_ADMIN и ROLE_SUPER_ADMIN) */}
                {(isRole.admin || isRole.superAdmin) && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Клиент</Form.Label>
                            <Form.Select name="client" value={newTask.client || ''} onChange={(e) => setNewTask({ ...newTask, client: e.target.value })} required>
                                <option value="">Выберите клиента</option>
                                {clients.map(client => (
                                <option key={client.id} value={`/api/clients/${client.id}`}>{client.title}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Статус</Form.Label>
                            <Form.Select name="status" value={newTask.status || ''} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} required>
                            <option value="">Выберите статус</option>
                            {statuses.map(status => (
                                <option key={status.id} value={`/api/statuses/${status.id}`}>{status.status}</option>
                            ))}
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                {/* Выбор исполнителя (только для ROLE_SUPER_ADMIN) */}
                {(isRole.superAdmin) && (
                    <Form.Group className="mb-3">
                        <Form.Label>Исполнитель</Form.Label>
                        <Form.Select name="worker" value={newTask.worker || ''} onChange={(e) => setNewTask({ ...newTask, worker: e.target.value })}>
                            <option value="">Выберите исполнителя</option>
                            {employees.map(employee => (
                            <option key={employee.id} value={`/api/employees/${employee.id}`}>{employee.user_id.name} {employee.user_id.surname}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}
                <Button variant="primary" onClick={handleCreateSave} disabled={!newTask.title}>Создать</Button>
            </Form>
        </div>
    );
};

export default NewTaskPage;