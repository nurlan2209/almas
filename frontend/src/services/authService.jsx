import { useState, useEffect, createContext, useContext } from 'react';

// Контекст авторизации для использования в компонентах
export const AuthContext = createContext();

// Пользовательский хук для работы с авторизацией
export const useAuth = () => useContext(AuthContext);

// Начальное состояние (заглушка для имитации бэкенда)
const initialState = {
  isAuthenticated: true,
  user: {
    firstName: 'Тест',
    lastName: 'Юзер',
    email: 'test@test.com'
  },
  loading: true,
};

// Провайдер авторизации
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);

  // Проверка сохраненного состояния авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuth({
            isAuthenticated: true,
            user,
            loading: false,
          });
        } else {
          setAuth({
            ...initialState,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuth({
          ...initialState,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Регистрация пользователя
  const register = async (userData) => {
    try {
      // Здесь должен быть запрос к API для регистрации
      // Заглушка для демонстрации:
      const user = { 
        ...userData,
        id: Math.random().toString(36).substring(2, 11), // Генерация случайного ID
        donations: [] // Пустая история донаций
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuth({
        isAuthenticated: true,
        user,
        loading: false,
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message || 'Ошибка регистрации' };
    }
  };

  // Авторизация пользователя
  const login = async (email, password) => {
    try {
      // Здесь должен быть запрос к API для авторизации
      // Заглушка для демонстрации:
      
      // В реальном приложении проверка будет происходить на сервере
      const storedUser = localStorage.getItem('user');
      let user = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
          // В реальности пароль должен проверяться на сервере!
          user = parsedUser;
        }
      }
      
      if (!user) {
        // Для демонстрации: если пользователь не найден, создаем тестового
        user = {
          id: Math.random().toString(36).substring(2, 11),
          email,
          firstName: 'Тестовый',
          lastName: 'Пользователь',
          iin: '123456789012',
          birthDate: '1990-01-01',
          gender: 'male',
          bloodType: 'II',
          rhFactor: 'positive',
          height: '175',
          weight: '75',
          donations: [
            {
              date: '2024-03-15',
              type: 'Цельная кровь',
              center: 'Центральный центр крови',
              status: 'Выполнено'
            }
          ]
        };
        
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setAuth({
        isAuthenticated: true,
        user,
        loading: false,
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  // Обновление данных пользователя
  const updateUserData = (updatedData) => {
    try {
      const updatedUser = { ...auth.user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setAuth({
        ...auth,
        user: updatedUser
      });
      
      return { success: true, user: updatedUser };
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