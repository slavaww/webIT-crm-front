import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/scss/crm.scss';
import { getUserDataFromToken } from '../utils/authUtils';

const MainLayout = () => {
  const navigate = useNavigate();
  const userData = getUserDataFromToken();

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

  const renderProfileLink = () => {
    if (!userData || !userData.roles) {
      // Не показывать ссылку, если пользователь не аутентифицирован
      return null;
    }

    // Если это СУПЕР-АДМИН, ссылка ведет на /settings (вне SPA)
    if (userData.roles.includes('ROLE_SUPER_ADMIN')) {
      return <><Link className="nav-link" to="/employee/profile">Профиль</Link><a href="/settings" className="nav-link">Настройки</a></>;
    }

    // Если это СОТРУДНИК, ссылка ведет на его кабинет в SPA
    if (userData.roles.includes('ROLE_ADMIN')) {
      return <Link className="nav-link" to="/employee/profile">Профиль</Link>;
    }

    // Если это КЛИЕНТ (по наличию clientId)
    if (userData.clientId) {
      return <Link className="nav-link" to="/profile">Профиль</Link>;
    }

    return null; // По умолчанию ничего не показываем
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
          {renderProfileLink()}
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
