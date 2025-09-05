// import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; // Импортируем декодер
import { Navigate } from 'react-router-dom';

const NewTaskPage = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Если токена нет, перенаправляем на страницу входа
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="cont">
            <h2 className="header">Страница создания новой задачи</h2>
        </div>
    );
};

export default NewTaskPage;