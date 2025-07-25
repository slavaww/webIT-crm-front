import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { formatTaskDate } from "../utils/dateFormat";

const TaskDetail = () => {
  const { id } = useParams(); // Получаем ID задачи из URL
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загрузка детальной задачи
    apiClient
      .get(`/tasks/${id}`)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Не удалось загрузить задачу.");
        setLoading(false);
      });

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return <div>Задача не найдена.</div>;
  

  return (
    <div className="container mt-4">
      <h2>Детали задачи: {task.title}</h2>
      <Card>
        <Card.Body>
          <Card.Text>
            <strong>Описание:</strong> {task.description}
          </Card.Text>
          <Card.Text>
            <strong>Дата создания:</strong>{" "}
            {new Date(task.create_date).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>Создатель:</strong> {task.creator?.name}{" "}
            {task.creator?.surname}
          </Card.Text>
          <Card.Text>
            <strong>Клиент:</strong> {task.client?.title}
          </Card.Text>
          <Card.Text>
            <strong>Дата начала:</strong>{" "}
            {task.start_time
              ? new Date(task.start_time).toLocaleString()
              : "Не указана"}
          </Card.Text>
          <Card.Text>
            <strong>Дата окончания:</strong>{" "}
            {task.end_time
              ? new Date(task.end_time).toLocaleString()
              : "Не указана"}
          </Card.Text>
          <Card.Text>
            <strong>Статус:</strong> {task.status?.status}
          </Card.Text>
          <Card.Text>
            <strong>Исполнитель:</strong> {task.worker?.user_id?.name}{" "}
            {task.worker?.user_id?.surname}{" ("}
            {task.worker?.job_title}{")"}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Комментарии</h3>
      {comments.map((comment) => (
        <ListGroup className="mb-3" key={comment.id}>
          <ListGroup.Item>
            {formatTaskDate(comment.created_at)}{" - "}
            <strong>
              {comment.author?.name} {comment.author?.surname}
            </strong>
              {" ("}{comment.author?.employee?.job_title || comment.author?.client?.title}{")"}
          </ListGroup.Item>
          <ListGroup.Item>
            {comment.description}
          </ListGroup.Item>
        </ListGroup>
      ))}
      {comments.length === 0 && <p>Нет комментариев.</p>}

      <Form.Group className="mb-3">
        <Form.Label>Добавить комментарий</Form.Label>
        <Form.Control
          as="textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleAddComment}>
        Добавить
      </Button>
    </div>
  );
};

export default TaskDetail;
