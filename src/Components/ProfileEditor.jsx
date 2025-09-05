import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import UserProfileSection from './UserProfileSection';
import ClientProfileSection from './ClientProfileSection';
import EmergencyContactSection from './EmergencyContactSection';
import PasswordSection from './PasswordSection';
import AutoDismissAlert from './AutoDismissAlert';

const isEmergencyContactFilled = (contact) => {
    if (!contact) return false;
    // Считаем контакт заполненным, если хотя бы одно из его полей не пустое
    return Object.values(contact).some(field => field && String(field).trim() !== '');
};

// Название компонента оставляем прежним, так как он редактирует профиль клиента
export default function ProfileEditor({ clientId }) {
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    // Добавляем отдельное состояние для нового пароля
    const [newPassword, setNewPassword] = useState('');
    const [emergencyContact, setEmergencyContact] = useState({
        title: '',
        job_title: '',
        phone: '',
        email: ''
    });
    const [isEmergencyFormVisible, setIsEmergencyFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (!clientId || !authToken) {
            setError('Не удалось определить клиента или токен авторизации.');
            setLoading(false);
            return;
        }

        setLoading(true);

        Promise.all([
            apiClient.get(`/clients/${clientId}`, { headers: { Authorization: `Bearer ${authToken}` } }),
            apiClient.get('/me', { headers: { Authorization: `Bearer ${authToken}` } })
        ])
        .then(([clientResponse, meResponse]) => {
            // Обрабатываем ответ от /api/clients/{id}
            const clientData = clientResponse.data;
            setProfile(clientData);
            if (isEmergencyContactFilled(clientData.client_emrg)) {
                setEmergencyContact(clientData.client_emrg);
                setIsEmergencyFormVisible(true);
            }

            // Обрабатываем ответ от /api/me
            setUser(meResponse.data);
        })
        .catch(err => {
            setError('Не удалось загрузить данные профиля.');
            console.error(err);
        })
        .finally(() => {
            // Сбрасываем загрузку в false
            setLoading(false);
        });
    }, [clientId, authToken]);

    // Обработчик для полей профиля клиента
    const handleChangeProfile = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };
    const handleChangeEmergency = (e) => {
        const { name, value } = e.target;
        setEmergencyContact(prev => ({ ...prev, [name]: value }));
    };
    const handleDeleteEmergencyContact = () => {
        // Сбрасываем данные контакта до пустых значений
        setEmergencyContact({ title: '', job_title: '', phone: '', email: '' });
        // Скрываем форму
        setIsEmergencyFormVisible(false);
        // Примечание: фактическое удаление произойдет при нажатии "Сохранить изменения",
        // так как в запрос будет отправлен `client_emrg: null`.
    };
    // Обработчик для полей профиля клиента - user'a
    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setUser(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    // Обработчик для поля пароля
    const handleChangePassword = (e) => {
        setNewPassword(e.target.value);
    };

    // Логика отправки
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Создаем массив запросов, которые нужно выполнить
        const requests = [];

        // Проверяем, нужно ли сохранять экстренный контакт
        const isEmergencyContactFilled = Object.values(emergencyContact).some(field => field && field.trim() !== '');

        // 1. Запрос на обновление данных клиента
        const clientData = {
            title: profile.title,
            description: profile.description,
            job_title: profile.job_title,
            phone: profile.phone,
            email: profile.email,
            client_emrg: isEmergencyContactFilled ? emergencyContact : null
        };
        requests.push(
            apiClient.patch(`/clients/${clientId}`, clientData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/merge-patch+json'
                }
            })
        );
        // 2. Запрос на обновление данных клиента - user'a
        let userData = {
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            ...(newPassword && { password: newPassword })
        };
        requests.push(
            apiClient.patch('/me', userData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/merge-patch+json'
                }
            })
        );

        try {
            // Выполняем все запросы параллельно
            await Promise.all(requests);
            setSuccess('Профиль успешно обновлен!');
            setNewPassword(''); // Очищаем поле пароля после успешного сохранения
        } catch (err) {
            setError('Ошибка при обновлении профиля.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) return <div>Загрузка...</div>;
    if (error && !success) return <div className="alert alert-danger">{error}</div>;
    if (!profile) return null;
    if (!user) return null;

    return (
        <div className="container mt-4">
            <h2>Редактирование профиля</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <ClientProfileSection profile={profile} onChange={handleChangeProfile} />
                {/* Данные пользователя (ФИО) */}
                <UserProfileSection user={user} onChange={handleChangeUser} />

                <EmergencyContactSection
                    contactData={emergencyContact}
                    isVisible={isEmergencyFormVisible}
                    onChange={handleChangeEmergency}
                    onShow={() => setIsEmergencyFormVisible(true)}
                    onDelete={handleDeleteEmergencyContact}
                />

                {/* ДОБАВЛЕННОЕ ПОЛЕ ПАРОЛЯ */}
                <hr className="my-4" />

                <PasswordSection password={newPassword} onChange={handleChangePassword} />

                <AutoDismissAlert 
                    message={success} 
                    type="success" 
                    onDismiss={() => setSuccess(null)} 
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
}
