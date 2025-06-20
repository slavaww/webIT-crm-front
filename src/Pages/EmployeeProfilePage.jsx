import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const EmployeeProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        patronymic: '',
        avatar_url: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        apiClient.get('/me')
            .then(response => {
                const data = response.data;
                setUserData(data); // Сохраняем все данные, включая `avatar` от нормализатора
                // Заполняем форму начальными данными
                setFormData({
                    name: data.name || '',
                    surname: data.surname || '',
                    patronymic: data.patronymic || '',
                    avatar_url: data.avatar_url || '', // Используем `avatar_url` для поля ввода
                    password: '', // Поле пароля всегда пустое при загрузке
                });
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить данные профиля.');
                setLoading(false);
            });
    }, []);

    console.log('userData:', userData);
    console.log('formData:', formData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Убираем пустые поля (особенно пароль), чтобы не отправлять их зря
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
            delete dataToUpdate.password;
        }

        try {
            // ЗАПРОС НА /api/me
            const response = await apiClient.patch('/me', dataToUpdate);
            setUserData(response.data); // Обновляем данные пользователя для отображения аватара
            setSuccess('Профиль успешно обновлен!');
            setFormData(prev => ({...prev, password: ''})); // Очищаем поле пароля
        } catch (err) {
            setError('Ошибка при обновлении профиля.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) return <div>Загрузка...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2>Личный кабинет сотрудника</h2>
            {success && <div className="alert alert-success">{success}</div>}
            
            {/* Отображаем аватар */}
            {userData?.avatar && (
                <div className="mb-4 text-center">
                    <img src={userData.avatar} alt="Аватар" className="rounded-circle" width="150" height="150" />
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                    <label className="form-label">URL аватара</label>
                    <input type="url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} className="form-control" />
                    <div className="form-text">Укажите прямую ссылку на изображение. Если поле пустое, будет использован Gravatar.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Новый пароль</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Оставьте пустым, если не меняете" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
            </form>
        </div>
    );
};

export default EmployeeProfilePage;
