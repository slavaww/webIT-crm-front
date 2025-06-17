import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/scss/crm.scss';
import axios from 'axios';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Отправляем запрос на сервер для уничтожения сессии
      await axios.get('/logout');
    } catch (error) {
      console.error('Ошибка при выходе из сессии на сервере:', error);
      // Даже если произошла ошибка, мы продолжаем выход на клиенте
    } finally {
      // 2. Очищаем токен на стороне клиента
      localStorage.removeItem('authToken');
      // 3. Перенаправляем на страницу входа нашего SPA
      // Используем navigate() из react-router-dom для внутреннего перехода
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="container py-3">
      <header>
        <div className="d-flex justify-content-between align-items-center">
            <h1>SPA раздел с изменениями</h1>
            <button onClick={handleLogout} className="btn btn-outline-secondary">Выйти</button>
        </div>
        <nav className="nav">
          <Link className="nav-link" to="/">Главная</Link>
          <Link className="nav-link" to="/profile">Профиль</Link>
        </nav>
      </header>
      
      <main className="mt-4">
        <Outlet />
      </main>

      <footer className="mt-5 text-muted">
        © SPA Footer
      </footer>
    </div>
  );
};

export default MainLayout;
