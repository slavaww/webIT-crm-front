import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskFormModal = ({ show, onHide, taskData, onChange, onSave, clients, statuses, employees, isRole }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{taskData.id ? 'Редактировать задачу' : 'Создать новую задачу'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control type="text" name="title" value={taskData.title || ''} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control as="textarea" name="description" value={taskData.description || ''} onChange={onChange} rows={3} />
          </Form.Group>

          {/* Выбор клиента (только для ROLE_ADMIN и ROLE_SUPER_ADMIN) */}
          {(isRole.admin || isRole.superAdmin) && (
            <Form.Group className="mb-3">
              <Form.Label>Клиент</Form.Label>
              <Form.Select name="client" value={taskData.client || ''} onChange={onChange} required>
                <option value="">Выберите клиента</option>
                {clients.map(client => (
                  <option key={client.id} value={`/api/clients/${client.id}`}>{client.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Выбор статуса (для всех) */}
          <Form.Group className="mb-3">
            <Form.Label>Статус</Form.Label>
            <Form.Select name="status" value={taskData.status || ''} onChange={onChange} required>
              <option value="">Выберите статус</option>
              {statuses.map(status => (
                <option key={status.id} value={`/api/statuses/${status.id}`}>{status.status}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Выбор исполнителя (толькодля ROLE_SUPER_ADMIN) */}
          {(isRole.superAdmin) && (
            <Form.Group className="mb-3">
              <Form.Label>Исполнитель</Form.Label>
              <Form.Select name="worker" value={taskData.worker || ''} onChange={onChange} required={isRole.admin}>
                <option value="">Выберите исполнителя</option>
                {employees.map(employee => (
                  <option key={employee.id} value={`/api/employees/${employee.id}`}>{employee.user_id.name} {employee.user_id.surname}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Даты (start_time, end_time) */}
          {(isRole.admin || isRole.superAdmin) && (
            <Form.Group className="mb-3">
                <Form.Label>Дата начала</Form.Label>
                <Form.Control type="datetime-local" name="start_time" value={taskData.start_time || ''} onChange={onChange} />
            </Form.Group>
          )}

          {(isRole.admin || isRole.superAdmin) && (
            <Form.Group className="mb-3">
                <Form.Label>Дата окончания</Form.Label>
                <Form.Control type="datetime-local" name="end_time" value={taskData.end_time || ''} onChange={onChange} />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Закрыть</Button>
        <Button variant="primary" onClick={onSave}>Сохранить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskFormModal;
