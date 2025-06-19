import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    // Можно указать baseURL, если все запросы к API начинаются одинаково
    baseURL: '/api' 
});

// Перехватчик (interceptor) для ЗАПРОСОВ
apiClient.interceptors.request.use(
    (config) => {
        // Получаем токен из localStorage
        const token = localStorage.getItem('authToken');
        // Если токен есть, добавляем его в заголовок Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Если произошла ошибка при формировании запроса
        return Promise.reject(error);
    }
);

// Перехватчик (interceptor) для ОТВЕТОВ
apiClient.interceptors.response.use(
    (response) => {
        // Если ответ успешный (статус 2xx), просто возвращаем его
        return response;
    },
    (error) => {
        // Если в ответе ошибка
        if (error.response && error.response.status === 401) {
            // Если это ошибка 401 (Unauthorized), значит токен просрочен или невалиден
            console.log('Токен истек или недействителен. Выполняется выход...');
            // Очищаем localStorage
            localStorage.removeItem('authToken');
            // Перенаправляем на страницу входа
            // Мы используем window.location для полной перезагрузки страницы,
            // чтобы сбросить все состояния React.
            window.location.href = '/crm/login'; 
        }
        // Возвращаем ошибку, чтобы .catch() в компонентах все еще мог ее обработать, если нужно
        return Promise.reject(error);
    }
);

export default apiClient;
