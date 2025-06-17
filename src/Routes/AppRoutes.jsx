import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Импортируем макет
import MainLayout from '../Layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Ленивая загрузка страниц
const HomePage = React.lazy(() => import('../Pages/HomePage'));
const ProfilePage = React.lazy(() => import('../Pages/ProfilePage'));
const LoginPage = React.lazy(() => import('../Pages/LoginPage'));

const LoadingSpinner = () => <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Роуты, требующие токен. Outlet будет внутри MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}> {/* <-- Теперь здесь просто "/" */}
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        
        {/* Публичный роут для страницы входа */}
        <Route path="/login" element={<LoginPage />} /> {/* <-- И здесь просто "/login" */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
