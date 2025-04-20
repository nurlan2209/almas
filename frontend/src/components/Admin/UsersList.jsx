import React from 'react';

const UsersList = ({ users, loading, error, onDelete, onView, onEdit }) => {
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="no-data">
        <p>Пользователи не найдены</p>
      </div>
    );
  }

  // Функция для отображения роли пользователя
  const getUserRole = (role) => {
    switch (role) {
      case 'donor':
        return 'Донор';
      case 'recipient':
        return 'Реципиент';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
  };

  return (
    <div className="users-list">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.last_name} {user.first_name} {user.patronymic || ''}
              </td>
              <td>{user.email}</td>
              <td>{user.phone_number || 'Не указан'}</td>
              <td>
                <span className={`user-role ${user.role}`}>
                  {getUserRole(user.role)}
                </span>
              </td>
              <td className="actions-cell">
                <button 
                  className="action-button view-button"
                  onClick={() => onView(user.id)}
                  title="Просмотр"
                >
                  👁️
                </button>
                <button 
                  className="action-button edit-button"
                  onClick={() => onEdit(user.id)}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button 
                  className="action-button delete-button"
                  onClick={() => onDelete(user.id)}
                  title="Удалить"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;