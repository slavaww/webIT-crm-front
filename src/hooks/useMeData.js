import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

export const useMeData = () => {
    const [userMe, setUserMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiClient.get('/me')
            .then(response => {
                setUserMe(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить данные профиля.');
                setLoading(false);
            });
    }, []);

    return { userMe, loading, error };
};