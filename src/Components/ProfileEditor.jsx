import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

        axios.get(`/api/clients/${clientId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
        .then(response => {
            setProfile(response.data);
            const emrgContact = response.data.client_emrg;
            // Проверяем, есть ли данные, и решаем, показывать ли форму
            if (isEmergencyContactFilled(emrgContact)) {
                setEmergencyContact(emrgContact);
                setIsEmergencyFormVisible(true); // Показываем форму, так как есть данные
            }
            setLoading(false);
        })
        .catch(err => {
            setError('Не удалось загрузить данные профиля.');
            setLoading(false);
        });
    }, [clientId, authToken]);

    useEffect(() => {
        axios.get('/api/me', { headers: { Authorization: `Bearer ${authToken}` } })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => setError('Не удалось загрузить данные профиля.'));
    }, [authToken]);

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
            axios.patch(`/api/clients/${clientId}`, clientData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/merge-patch+json'
                }
            })
        );
        let userData = {
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic
        };
        
        // 2. Запрос на смену пароля (отправляется, только если поле пароля не пустое)
        if (newPassword) {
            userData.password = newPassword;
        }

        // 3. Запрос на обновление данных клиента - user'a
        requests.push(
            axios.patch('/api/me', userData, {
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
            <h2>Редактирование профиля клиента</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Название клиента (ФИО или компания)</label>
                    <input type="text" className="form-control" id="title" name="title" value={profile.title} onChange={handleChangeProfile} />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Имя</label>
                    <input type="text" className="form-control" id="name" name="name" value={user.name || ''} onChange={handleChangeUser} />
                </div>
                <div className="mb-3">
                    <label htmlFor="patronymic" className="form-label">Отчество</label>
                    <input type="text" className="form-control" id="patronymic" name="patronymic" value={user.patronymic || ''} onChange={handleChangeUser} />
                </div>
                <div className="mb-3">
                    <label htmlFor="surname" className="form-label">Фамилия</label>
                    <input type="text" className="form-control" id="surname" name="surname" value={user.surname || ''} onChange={handleChangeUser} />
                </div>
                <div className="mb-3">
                    <label htmlFor="job_title" className="form-label">Должность</label>
                    <input type="text" className="form-control" id="job_title" name="job_title" value={profile.job_title || ''} onChange={handleChangeProfile} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Контактный Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={profile.email || ''} onChange={handleChangeProfile} />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Телефон</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={profile.phone || ''} onChange={handleChangeProfile} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea className="form-control" id="description" name="description" value={profile.description || ''} onChange={handleChangeProfile} rows="3"></textarea>
                </div>

                {/* РАЗДЕЛ ДЛЯ ЭКСТРЕННОГО КОНТАКТА */}
                <div className="emergency-contact-section">
                    <legend className="h5">Экстренный контакт</legend>
                    
                    {isEmergencyFormVisible ? (
                        // Если форма видима, показываем поля и кнопку "Удалить"
                        <fieldset>
                            <p className="text-muted small">Заполните, если хотите указать заместителя. Чтобы удалить, очистите все поля и сохраните, или нажмите кнопку "Удалить".</p>
                            <div className="mb-3">
                                <label htmlFor="emrg_title" className="form-label">ФИО контакта</label>
                                <input type="text" className="form-control" id="emrg_title" name="title" value={emergencyContact.title || ''} onChange={handleChangeEmergency} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="emrg_job_title" className="form-label">Должность</label>
                                <input type="text" className="form-control" id="emrg_job_title" name="job_title" value={emergencyContact.job_title || ''} onChange={handleChangeEmergency} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="emrg_email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="emrg_email" name="email" value={emergencyContact.email || ''} onChange={handleChangeEmergency} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="emrg_phone" className="form-label">Телефон</label>
                                <input type="text" className="form-control" id="emrg_phone" name="phone" value={emergencyContact.phone || ''} onChange={handleChangeEmergency} />
                            </div>
                            <button type="button" onClick={handleDeleteEmergencyContact} className="btn btn-sm btn-outline-danger">
                                Удалить доп. контакт
                            </button>
                        </fieldset>
                    ) : (
                        // Если форма скрыта, показываем кнопку "Добавить"
                        <button type="button" onClick={() => setIsEmergencyFormVisible(true)} className="btn btn-secondary">
                            Добавить дополнительный контакт
                        </button>
                    )}
                </div>

                {/* ДОБАВЛЕННОЕ ПОЛЕ ПАРОЛЯ */}
                <hr className="my-4" />
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Новый пароль</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={newPassword} 
                        onChange={handleChangePassword} 
                        placeholder="Оставьте пустым, если не хотите менять" 
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
}
