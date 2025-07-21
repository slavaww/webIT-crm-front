import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Импортируем макет
import MainLayout from '../Layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Ленивая загрузка страниц
const HomePage = React.lazy(() => import('../Pages/HomePage'));
const ProfilePage = React.lazy(() => import('../Pages/ProfilePage'));
const LoginPage = React.lazy(() => import('../Pages/LoginPage'));
const EmployeeProfilePage = React.lazy(() => import('../Pages/EmployeeProfilePage'));

const LoadingSpinner = () => <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Роуты, требующие токен. Outlet внутри MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="employee/profile" element={<EmployeeProfilePage />} />
          </Route>
        </Route>
        
        {/* Публичный роут для страницы входа */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
