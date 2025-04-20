import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from './apiService';

// Контекст авторизации для использования в компонентах
export const AuthContext = createContext();

// Пользовательский хук для работы с авторизацией
export const useAuth = () => useContext(AuthContext);

// Провайдер авторизации
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Проверка сохраненного состояния авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем наличие токена в localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Если токен есть, получаем данные пользователя с сервера
          const response = await authAPI.getCurrentUser();
          setAuth({
            isAuthenticated: true,
            user: response.user,
            loading: false,
          });
        } else {
          // Если токена нет, пользователь не авторизован
          setAuth({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // В случае ошибки (например, недействительный токен) сбрасываем авторизацию
        localStorage.removeItem('token');
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Регистрация пользователя
  const register = async (userData) => {
    try {
      // Отправляем запрос на регистрацию
      const response = await authAPI.register(userData);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.token);
      
      // Обновляем состояние авторизации
      setAuth({
        isAuthenticated: true,
        user: response.user,
        loading: false,
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message || 'Ошибка регистрации' };
    }
  };

  // Авторизация пользователя
  const login = async (email, password) => {
    try {
      // Отправляем запрос на авторизацию
      const response = await authAPI.login(email, password);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.token);
      
      // Обновляем состояние авторизации
      setAuth({
        isAuthenticated: true,
        user: response.user,
        loading: false,
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  // Выход пользователя
  const logout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    
    // Обновляем состояние авторизации
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  // Обновление данных пользователя
  const updateUserData = async (updatedData) => {
    try {
      // Получаем обновленные данные с сервера
      const response = await authAPI.updateProfile(updatedData);
      
      // Обновляем состояние пользователя
      setAuth({
        ...auth,
        user: response.user
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Update user data failed:', error);
      return { success: false, error: error.message || 'Ошибка обновления данных' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        loading: auth.loading,
        register,
        login,
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default {
  AuthProvider,
  useAuth,
  AuthContext
};