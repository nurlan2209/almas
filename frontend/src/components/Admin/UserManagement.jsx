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
        throw new Error('Авторизация қажет');
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
        throw new Error(`Сұраныс қатесі: ${response.status}`);
      }
      
      const data = await response.json();
      
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.pages);
      setCurrentPage(data.page);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Пайдаланушылар тізімін жүктеу мүмкін болмады');
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
    if (!window.confirm('Бұл пайдаланушыны шынымен жойғыңыз келе ме?')) {
      return;
    }
    
    try {
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Авторизация қажет');
      }
      
      // Запрос к API для удаления пользователя
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Сұраныс қатесі: ${response.status}`);
      }
      
      // Обновляем список пользователей после удаления
      fetchUsers(currentPage, { role: roleFilter, search: searchTerm });
      
      alert('Пайдаланушы сәтті жойылды');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(`Пайдаланушыны жою кезінде қате пайда болды: ${err.message}`);
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
                <h2 className="admin-section-title">Пайдаланушыларды басқару</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/admin/users/create')}
                >
                  Пайдаланушы қосу
                </button>
              </div>
              
              <div className="admin-card">
                <div className="admin-filters">
                  <div className="filter-group">
                    <label htmlFor="role-filter">Рөл:</label>
                    <select
                      id="role-filter"
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                    >
                      <option value="">Барлығы</option>
                      <option value="donor">Донорлар</option>
                      <option value="recipient">Реципиенттер</option>
                      <option value="admin">Әкімшілер</option>
                    </select>
                  </div>
                  
                  <form className="search-form" onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Аты, email бойынша іздеу..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button type="submit" className="btn btn-outline">Іздеу</button>
                  </form>
                  
                  <button 
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                  >
                    Қалпына келтіру
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
                    {totalUsers} пайдаланушыдан {users.length} көрсетілді
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