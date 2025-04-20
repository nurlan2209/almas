import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UsersList from './UsersList';
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import './UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Требуется авторизация');
      }
      
      // Формирование параметров запроса
      const queryParams = new URLSearchParams({
        page,
        per_page: 10,
        ...filters
      });
      
      // Запрос к API для получения списка пользователей
      const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }
      
      const data = await response.json();
      
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.pages);
      setCurrentPage(data.page);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка списка пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers(currentPage, { role: roleFilter, search: searchTerm });
  }, [currentPage, roleFilter, searchTerm]);

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Обработчик изменения фильтра по роли
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем страницу на первую при изменении фильтра
  };

  // Обработчик изменения поисковой строки
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик применения поиска
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем страницу на первую при поиске
  };

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setRoleFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Обработчик удаления пользователя
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    
    try {
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Требуется авторизация');
      }
      
      // Запрос к API для удаления пользователя
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }
      
      // Обновляем список пользователей после удаления
      fetchUsers(currentPage, { role: roleFilter, search: searchTerm });
      
      alert('Пользователь успешно удален');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(`Ошибка при удалении пользователя: ${err.message}`);
    }
  };

  return (
    <div className="user-management">
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Управление пользователями</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/admin/users/create')}
                >
                  Добавить пользователя
                </button>
              </div>
              
              <div className="admin-card">
                <div className="admin-filters">
                  <div className="filter-group">
                    <label htmlFor="role-filter">Роль:</label>
                    <select
                      id="role-filter"
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                    >
                      <option value="">Все</option>
                      <option value="donor">Доноры</option>
                      <option value="recipient">Реципиенты</option>
                      <option value="admin">Администраторы</option>
                    </select>
                  </div>
                  
                  <form className="search-form" onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Поиск по имени, email..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button type="submit" className="btn btn-outline">Поиск</button>
                  </form>
                  
                  <button 
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                  >
                    Сбросить
                  </button>
                </div>
                
                <UsersList 
                  users={users}
                  loading={loading}
                  error={error}
                  onDelete={handleDeleteUser}
                  onView={(id) => navigate(`/admin/users/${id}`)}
                  onEdit={(id) => navigate(`/admin/users/${id}/edit`)}
                />
                
                <div className="admin-pagination">
                  <div className="pagination-info">
                    Показано {users.length} из {totalUsers} пользователей
                  </div>
                  <div className="pagination-buttons">
                    <button
                      className="pagination-button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      &laquo;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      className="pagination-button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      &raquo;
                    </button>
                  </div>
                </div>
              </div>
            </>
          }
        />
        
        <Route 
          path="/create" 
          element={<UserForm onSuccess={() => {
            fetchUsers(currentPage, { role: roleFilter, search: searchTerm });
            navigate('/admin/users');
          }} />} 
        />
        
        <Route 
          path="/:id" 
          element={<UserDetails onBack={() => navigate('/admin/users')} />} 
        />
        
        <Route 
          path="/:id/edit" 
          element={<UserForm isEditing onSuccess={() => {
            fetchUsers(currentPage, { role: roleFilter, search: searchTerm });
            navigate('/admin/users');
          }} />} 
        />
      </Routes>
    </div>
  );
};

export default UserManagement;