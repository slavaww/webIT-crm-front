import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileEditor({ clientId }) {
    const [profile, setProfile] = useState({
        title: '',
        description: '',
        job_title: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Получаем токен из localStorage (или где он у вас хранится)
    const authToken = localStorage.getItem('authToken');

    // Функция для получения данных профиля при загрузке компонента
    useEffect(() => {
        if (!clientId || !authToken) {
            setError('Не удалось определить клиента или токен авторизации.');
            setLoading(false);
            return;
        }

        axios.get(`/api/clients/${clientId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            setProfile(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError('Не удалось загрузить данные профиля. Возможно, у вас нет доступа.');
            setLoading(false);
        });
    }, [clientId, authToken]);

    // Обработчик изменений в полях формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        axios.patch(`/api/clients/${clientId}`, profile, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // Указываем правильный Content-Type для PATCH-запросов в API Platform
                'Content-Type': 'application/merge-patch+json'
            }
        })
        .then(response => {
            setProfile(response.data);
            setSuccess('Профиль успешно обновлен!');
            setLoading(false);
        })
        .catch(err => {
            setError('Ошибка при обновлении профиля.');
            setLoading(false);
        });
    };

    if (loading && !profile.title) return <div>Загрузка...</div>;
    if (error && !success) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Редактирование профиля</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Название клиента (ФИО или компания)</label>
                    <input type="text" className="form-control" id="title" name="title" value={profile.title} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="job_title" className="form-label">Должность</label>
                    <input type="text" className="form-control" id="job_title" name="job_title" value={profile.job_title || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Контактный Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={profile.email || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Телефон</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={profile.phone || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea className="form-control" id="description" name="description" value={profile.description || ''} onChange={handleChange} rows="3"></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
}
