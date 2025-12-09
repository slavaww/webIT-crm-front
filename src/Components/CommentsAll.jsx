import { useEffect, useState } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
import MDEditor from "@uiw/react-md-editor";
import ImageUploadButton from "./ImageUploadButton";
import { formatTaskDate } from "../utils/dateFormat";
import apiClient from "../api/axiosConfig";

const CommentsAll = ({id}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await apiClient.post("/images/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.url;
        } catch (err) {
            console.error("Ошибка загрузки:", err);
            return null;
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
        <>
            <h3 className="mt-4">Комментарии</h3>
      {comments.map((comment) => (
        <ListGroup className="mb-3" key={comment.id}>
          <ListGroup.Item>
            {formatTaskDate(comment.created_at)}
            {" - "}
            <strong>
              {comment.author?.name} {comment.author?.surname}
            </strong>
            {" ("}
            {comment.author?.employee?.job_title ||
              comment.author?.client?.title}
            {")"}
          </ListGroup.Item>
          <ListGroup.Item>
            {/* {comment.description} */}
            <MDEditor.Markdown source={comment.description} />
          </ListGroup.Item>
        </ListGroup>
      ))}
      {comments.length === 0 && <p>Нет комментариев.</p>}

      <Form.Group className="mb-3">
        <Form.Label>Добавить комментарий</Form.Label>
        <div className="mb-2">
          <ImageUploadButton 
            onImageUpload={handleImageUpload}
            onInsert={(markdown) => setNewComment(prev => prev + '\n' + markdown)}
            />
        </div>
        <MDEditor
          value={newComment}
          onChange={setNewComment}
          height={200}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleAddComment}>
        Добавить
      </Button>
        </>
    );
};

export default CommentsAll;