import React from 'react';
import { createRoot } from 'react-dom/client';
import ModalConfirm from '../Components/ModalConfirm';

/**
 * Показывает модальное окно подтверждения и возвращает Promise,
 * который разрешается в `true` при подтверждении и в `false` при отмене.
 * @param {object} options - Опции для модального окна.
 * @param {string} options.message - Основное сообщение в модальном окне.
 * @param {string} [options.title='Подтверждение'] - Заголовок окна.
 * @param {string} [options.additionalMessage=''] - Дополнительное сообщение.
 * @param {string} [options.confirmButtonText='Подтвердить'] - Текст кнопки подтверждения.
 * @param {string} [options.confirmButtonVariant='primary'] - Стиль кнопки подтверждения.
 * @returns {Promise<boolean>}
 */
export const confirmModal = (options) => {
  return new Promise((resolve) => {
    // Создаем временный контейнер для нашего модального окна
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    // Функция для очистки: размонтирует компонент и удаляет контейнер
    const cleanup = (result) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    const handleConfirm = () => {
      cleanup(true);
    };

    const handleHide = () => {
      cleanup(false);
    };

    // Рендерим компонент ModalConfirm с нужными props
    root.render(
      <ModalConfirm
        {...options}
        show={true}
        onConfirm={handleConfirm}
        onHide={handleHide}
      />
    );
  });
};