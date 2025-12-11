import { useEffect, useState } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
import MDEditor from "@uiw/react-md-editor";
import ImageUploadButton from "./ImageUploadButton";
import { formatTaskDate } from "../utils/dateFormat";
import apiClient from "../api/axiosConfig";
import { useImageUpload } from "../hooks/useImageUpload";

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
          <ListGroup className="mb-3" key={comment.id}>
            <ListGroup.Item>
              <div className="d-flex justify-content-between align-items-center">
                <div className="comment-author">
                  {formatTaskDate(comment.created_at)}
                  {" - "}
                  <strong>
                    {comment.author?.name} {comment.author?.surname}
                  </strong>
                  {" ("}
                  {comment.author?.employee?.job_title ||
                    comment.author?.client?.title}
                  {")"}
                </div>
                <div className="comment-edit">
                  {/* <EditSVG color="#000" /> */}
                </div>
              </div>
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