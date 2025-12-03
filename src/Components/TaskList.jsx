import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatTaskDate } from '../utils/dateFormat';

const TaskList = ({ tasks, isRole, onDelete }) => {
  if (tasks.length === 0) return <div className="mt-3 mx-3 alert alert-danger">Нет задач для отображения.</div>;  

  const getStatusId = (statusUrl) => {
    if (!statusUrl) return 'not';
    return statusUrl.replace(/\/api\/statuses\//, '');
    // или: return statusUrl.split('/').pop();
  };
  
  return (
    <div className="task-list-wrapper px-1 px-md-2">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className='task-list-marker'></th> 
            {(isRole.admin || isRole.superAdmin) && 
            <th className='task-list-client'>Клиент</th>
            }
            <th className='task-list-title'>Задача</th>
            <th className='task-list-date-create'>Создана</th> 
            <th className='d-none d-xl-table-cell task-list-date-start'>Дата начала<br />Дата окончания</th>
            <th className='d-none d-sm-table-cell task-list-status'>Статус</th>
            <th className='d-none d-lg-table-cell task-list-creator'>Создатель</th>
            {(isRole.client || isRole.superAdmin) && 
            <th className='d-none d-md-table-cell task-list-worker'>Исполнитель</th>
            }
            {isRole.superAdmin && (
              <th>Действия</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td className='text-center'><span className={`task-list-marker-circle status-${getStatusId(task.status["@id"])}`}></span></td>
              {(isRole.admin || isRole.superAdmin) && (
                <td className='task-list-client'>{task.client?.title || 'Внутренняя задача'}</td>
              )}
              <td><Link className='link-light link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover' to={`/tasks/${task.id}`}>{task.title}</Link></td>
              <td>{formatTaskDate(task.create_date)}</td>
              <td className='d-none d-xl-table-cell task-list-date-start'> 
                  {task.start_time
                      ? <>{formatTaskDate(task.start_time)}<br />{
                          task.end_time 
                          ? formatTaskDate(task.end_time) 
                          : 'Не окончена'
                      }</>
                      : 'Не начата'
                  }
              </td>
              <td className={`d-none d-sm-table-cell task-list-status status-${getStatusId(task.status["@id"])}`}>{task.status?.status || 'Не указан'}</td>
              <td className='d-none d-lg-table-cell task-list-creator'>{task.creator?.name} {task.creator?.surname}</td>
              {(isRole.client || isRole.superAdmin) && (
                <td className='d-none d-md-table-cell task-list-worker'>
                  {(() => {
                    const employee = task.worker?.user_id;
                    if (!employee) return 'Не назначен';
                    return `${employee.name} ${employee.surname}`;
                  })()}
                </td>
              )}
                {isRole.superAdmin && (
                  <td>
                    <Button variant="danger" size="sm" className="ml-2" onClick={() => onDelete(task.id)}>Удалить</Button>
                  </td>
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
