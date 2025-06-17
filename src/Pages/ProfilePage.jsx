import React from 'react';
import { jwtDecode } from 'jwt-decode'; // Импортируем декодер
import { Navigate } from 'react-router-dom';
import ProfileEditor from '../Components/ProfileEditor'; // Переместите ProfileEditor.jsx в папку components

const ProfilePage = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Если токена нет, перенаправляем на страницу входа
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const clientId = decodedToken.clientId;

        if (!clientId) {
            return <div className="alert alert-danger">Ошибка: ID клиента не найден в токене.</div>;
        }

        // Рендерим редактор профиля, передавая ему clientId
        return <ProfileEditor clientId={clientId} />;

    } catch (error) {
        console.error("Invalid token:", error);
        // Если токен невалидный, также перенаправляем на логин
        return <Navigate to="/login" replace />;
    }
};

export default ProfilePage;
