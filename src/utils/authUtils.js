import { jwtDecode } from 'jwt-decode';

export const getUserDataFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
};
