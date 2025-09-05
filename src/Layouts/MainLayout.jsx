import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/scss/crm.scss';
import { getUserDataFromToken } from '../utils/authUtils';
import renderHeader from '../Components/RenderHeader';

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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Очистка события при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderProfileLink = () => {
    if (!userData || !userData.roles) {
      // Не показывать ссылку, если пользователь не аутентифицирован
      return null;
    }

    // Если это СУПЕР-АДМИН, ссылка ведет на /settings (вне SPA)
    if (userData.roles.includes('ROLE_SUPER_ADMIN')) {
      return (
        <>
          <div className="aside-nav-item">
            <NavLink
              className={`aside-nav-link profile ${isScrolled ? 'scrolled' : ''}`}
              to="/employee/profile"
              data-tooltip="Профиль"
            ></NavLink>
          </div>
          <div className="aside-nav-item">
            <a href="/settings" className="aside-nav-link settings" data-tooltip="Настройки"></a>
          </div>
        </>
      );
    }

    // Если это СОТРУДНИК, ссылка ведет на его кабинет в SPA
    if (userData.roles.includes('ROLE_ADMIN')) {
      return (
        <div className="aside-nav-item">
          <NavLink
            className="aside-nav-link profile"
            to="/employee/profile"
            data-tooltip="Профиль"
          ></NavLink>
        </div>
      );
    }

    // Если это КЛИЕНТ (по наличию clientId)
    if (userData.clientId) {
      return ( 
        <div className="aside-nav-item">
          <NavLink
            className="aside-nav-link profile"
            to="/profile"
            data-tooltip="Профиль"
          ></NavLink>
        </div>
      );
    }

    return null; // По умолчанию ничего не показываем
  };

  return (
    <div className="main-layout">
      <aside className='aside-nav'>
        <div className={`aside-brand ${isScrolled ? 'scrolled' : ''}`}></div>
        <nav className="aside-nav-bar">
          {renderProfileLink()}
          <div className="aside-nav-item">
            <NavLink 
              className="aside-nav-link tasks"
              to="/"
              data-tooltip="Задачи"
            ></NavLink>
          </div>
          <div className="aside-nav-item">
            <NavLink 
              className="aside-nav-link task"
              to="/newtask"
              data-tooltip="Создать задачу"
            ></NavLink>
          </div>
          <div className="aside-nav-item">
              <button onClick={handleLogout} className="aside-nav-link logout" data-tooltip="Выйти"></button>
          </div>
        </nav>
      </aside>
      <main className='main-body'>
        <header className={
                  `d-flex justify-content-end align-items-center header-line px-2 px-md-4 px-lg-5
                  ${isScrolled ? 'scrolled' : ''}`
                }
        >
            {renderHeader(isScrolled)}
        </header>
        
        <main className="main-content">
          <Outlet />
        </main>

        <footer className="mt-5 text-muted">
          © SPA Footer
        </footer>
      </main>
  </div>
  );
};

export default MainLayout;
