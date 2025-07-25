import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatTaskDate } from '../utils/dateFormat';

const TaskList = ({ tasks, clients, statuses, employees, isRole, onEdit, onDelete }) => {
  if (tasks.length === 0) return <div className="mt-3 alert alert-danger">Нет задач для отображения.</div>;


  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          {(isRole.admin || isRole.superAdmin) && 
          <th>Клиент</th>}
          <th>Создатель</th>
          <th>Название</th>
          <th>Дата создания</th> 
          <th>Дата начала<br />Дата окончания</th>
          <th>Статус</th>
          {(isRole.client || isRole.superAdmin) && <th>Исполнитель</th>}
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            {(isRole.admin || isRole.superAdmin) && (
              <td>{task.client?.title || 'Внутренняя задача'}</td>
            )}
            <td>{task.creator?.name} {task.creator?.surname}</td>
            <td><Link to={`/tasks/${task.id}`}>{task.title}</Link></td>
            <td>{formatTaskDate(task.create_date)}</td>
            <td> 
                {task.start_time
                    ? <>{formatTaskDate(task.start_time)}<br />{
                        task.end_time 
                        ? formatTaskDate(task.end_time) 
                        : 'Не окончена'
                    }</>
                    : 'Не начата'
                }
            </td>
            <td>{task.status?.status || 'Не указан'}</td>
            {(isRole.client || isRole.superAdmin) && (
              <td>
                {(() => {
                  const employee = task.worker?.user_id;
                  if (!employee) return 'Не назначен';
                  return `${employee.name} ${employee.surname}`;
                })()}
              </td>
            )}
            <td>
              <Button variant="primary" size="sm" onClick={() => onEdit(task)}>Редактировать</Button>
              {isRole.superAdmin && (
                <Button variant="danger" size="sm" className="ml-2" onClick={() => onDelete(task.id)}>Удалить</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
