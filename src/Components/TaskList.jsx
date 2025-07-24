import React from 'react';
import { Button } from 'react-bootstrap';

function formatTaskDate(dateString, fallback = '') {
  if (!dateString) return fallback;
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return fallback;
  }
}

const TaskList = ({ tasks, clients, statuses, employees, isRole, onEdit, onDelete }) => {
  if (tasks.length === 0) return <div className="mt-3 alert alert-danger">Нет задач для отображения.</div>;

  const br = '<br />';

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          {(isRole.admin || isRole.superAdmin) && <th>Клиент</th>}
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
              <td>{clients.find(s => s["@id"] === task.client)?.title || 'Внутренняя задача'}</td>
            )}
            <td>{task.title}</td>
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
            <td>{statuses.find(s => s["@id"] === task.status)?.status || 'Не указан'}</td>
            {(isRole.client || isRole.superAdmin) && (
              <td>
                {(() => {
                  const employee = employees.find(s => s["@id"] === task.worker);
                  if (!employee?.user_id) return 'Не назначен';
                  return `${employee.user_id.name} ${employee.user_id.surname}`;
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
