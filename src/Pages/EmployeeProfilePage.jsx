import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const EmployeeProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        apiClient.get('/me', { headers: { Authorization: `Bearer ${authToken}` } })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => setError('Не удалось загрузить данные профиля.'));
    }, [authToken]);

    const handleSubmit = (formData) => {
        setLoading(true);
        setSuccess(null);
        setError(null);

        // Убираем пустые поля, чтобы не отправлять их
        const dataToUpdate = Object.fromEntries(
            Object.entries(formData).filter(([, value]) => value !== '')
        );

        apiClient.patch('/me', dataToUpdate, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/merge-patch+json',
            }
        })
        .then(response => {
            setUser(response.data);
            setSuccess('Профиль успешно обновлен!');
        })
        .catch(() => setError('Ошибка при обновлении профиля.'))
        .finally(() => setLoading(false));
    };

    if (loading && !user) return <div>Загрузка...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2>Личный кабинет сотрудника</h2>
            {success && <div className="alert alert-success">{success}</div>}
            <EmployeeProfileForm initialData={user} onSubmit={handleSubmit} isLoading={loading} />
        </div>
    );
};

// Внутренний компонент формы
const EmployeeProfileForm = ({ initialData, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        surname: initialData.surname || '',
        patronymic: initialData.patronymic || '',
        password: '', // Пароль всегда пустой при загрузке
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
                <label className="form-label">Имя</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
                <label className="form-label">Отчество</label>
                <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
                <label className="form-label">Фамилия</label>
                <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
                <label className="form-label">Новый пароль (оставьте пустым, если не меняете)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
        </form>
    );
};

export default EmployeeProfilePage;
