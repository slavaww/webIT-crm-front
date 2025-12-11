import { useState } from 'react';
import apiClient from '../api/axiosConfig';

/**
 * Кастомный хук для загрузки изображений.
 * @returns {{uploadImage: (function(*): Promise<null|*>), isUploading: boolean, uploadError: null|string}}
 */
export const useImageUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        setUploadError(null);

        try {
            const response = await apiClient.post("/images/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.url;
        } catch (err) {
            setUploadError("Ошибка при загрузке изображения.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading, uploadError };
};