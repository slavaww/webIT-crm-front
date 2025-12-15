import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import apiClient from '../api/axiosConfig';
import UserProfileSection from '../Components/UserProfileSection'
import AutoDismissAlert from '../Components/AutoDismissAlert';

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
        <div className="container-fluid pt-4 px-4">
            <h2>Личный кабинет</h2>

            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <UserProfileSection user={formData} onChange={handleChange} />
                    <div className="col-6">
                        {userData?.avatar && (
                            <div className="mb-4 text-center">
                                <img src={userData.avatar} alt="Аватар" className="rounded-circle" width="150" height="150" />
                            </div>
                        )}
                        <Form.Group className="mb-3" controlId="avatar_url">
                            <Form.Label>URL аватара</Form.Label>
                            <Form.Control type="url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} />
                            <Form.Text className="text-muted">Укажите прямую ссылку на изображение. Если поле пустое, будет использован Gravatar.</Form.Text>
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Новый пароль</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Новый пароль" />
                    <Form.Text className="text-muted">Оставьте поле пустым, если не меняете пароль.</Form.Text>
                </Form.Group>
                <AutoDismissAlert
                    message={success}
                    type="success"
                    onDismiss={() => setSuccess(null)}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </Form>
        </div>
    );
};

export default EmployeeProfilePage;
