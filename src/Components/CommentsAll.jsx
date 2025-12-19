import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import MDEditor from "@uiw/react-md-editor";
import ImageUploadButton from "./ImageUploadButton";
import apiClient from "../api/axiosConfig";
import { useImageUpload } from "../hooks/useImageUpload";
import CommentItem from "./CommentItem";

const CommentsAll = ({id}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    
    const { uploadImage, isUploading, uploadError } = useImageUpload();
    
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await apiClient.post(
                `/tasks/${id}/comments`,
                {
                    description: newComment,
                    task: `/api/tasks/${id}`,
                },
                { headers: { "Content-Type": "application/ld+json" } }
                );
                setComments([...comments, response.data]);
                setNewComment("");
            } catch (err) {
                setError("Ошибка при добавлении комментария.");
            }
        }
    };

    useEffect(() => {
        // Загрузка комментариев
        apiClient
            .get(`/tasks/${id}/comments`)
            .then((response) => {
                setComments(response.data["member"] || []);
            })
            .catch((err) => {
                setError("Не удалось загрузить комментарии.");
        });
    }, [id]);


    return (
      <div className="comments-block mt-4">
        <h3 className="mb-4">Комментарии</h3>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && <p>Нет комментариев.</p>}

        <Form.Group className="mb-3">
          <Form.Label>Добавить комментарий</Form.Label>
          <div className="mb-2">
            <ImageUploadButton
              onImageUpload={uploadImage}
              onInsert={(markdown) => setNewComment(prev => prev + '\n' + markdown)}
            />
          </div>
          {isUploading && <p>Загрузка изображения...</p>}
          {uploadError && <p className="text-danger">{uploadError}</p>}
          <MDEditor
            value={newComment}
            onChange={setNewComment}
            preview={isUploading ? "preview" : "edit"}
            height={200}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddComment}>
          Добавить
        </Button>
      </div>
    );
};

export default CommentsAll;