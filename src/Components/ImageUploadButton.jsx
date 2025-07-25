import React from "react";
import { Button } from "react-bootstrap";

const ImageUploadButton = ({ onImageUpload, onInsert }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, выберите файл изображения');
      return;
    }

    // Загружаем изображение и получаем URL
    if (file) {
      const url = await onImageUpload(file);
      if (url) {
        const markdown = `![${file.name}](${url})`;
        onInsert(markdown); // Передаем Markdown в родительский компонент
      }
    }
    // Сбрасываем значение input, чтобы можно было загрузить тот же файл снова
    e.target.value = '';
  };

  return (
    <>
      <Button variant="light" onClick={handleClick} size="sm">
        <i className="bi bi-image"></i> Вставить изображение
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </>
  );
};

export default ImageUploadButton;