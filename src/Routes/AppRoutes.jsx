import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Импортируем макет
import MainLayout from '../Layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Ленивая загрузка страниц
const TasksPage = React.lazy(() => import('../Pages/TasksPage'));
const ProfilePage = React.lazy(() => import('../Pages/ProfilePage'));
const NewTaskPage = React.lazy(() => import('../Pages/NewTaskPage'));
const LoginPage = React.lazy(() => import('../Pages/LoginPage'));
const EmployeeProfilePage = React.lazy(() => import('../Pages/EmployeeProfilePage'));
const TaskDetailPage = React.lazy(() => import('../Pages/TaskDetailPage'));

const LoadingSpinner = () => <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Роуты, требующие токен. Outlet внутри MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<TasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="newtask" element={<NewTaskPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
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
