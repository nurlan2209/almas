// src/services/apiService.js
// Сервис для работы с API бэкенда

const API_URL = 'http://localhost:5000/api';

// Получение JWT токена из localStorage
const getToken = () => localStorage.getItem('token');

// Базовая функция для выполнения запросов к API
const fetchAPI = async (endpoint, options = {}) => {
  // Добавляем базовый URL к эндпоинту
  const url = `${API_URL}${endpoint}`;

  // Устанавливаем заголовки по умолчанию
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Если есть токен, добавляем его в заголовки
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Объединяем настройки
  const config = {
    ...options,
    headers,
  };

  // Выполняем запрос
  try {
    const response = await fetch(url, config);
    
    // Если сервер не вернул успешный ответ, выбрасываем ошибку
    if (!response.ok) {
      // Пытаемся получить текст ошибки из ответа
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || errorData?.message || `HTTP error! Status: ${response.status}`
      );
    }
    
    // Если ответ пустой, возвращаем null
    if (response.status === 204) {
      return null;
    }
    
    // Возвращаем данные в формате JSON
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API-методы для работы с аутентификацией
export const authAPI = {
  // Регистрация нового пользователя
  register: (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Авторизация пользователя
  login: (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Получение информации о текущем пользователе
  getCurrentUser: () => {
    return fetchAPI('/auth/me');
  },
};

// API-методы для работы с пользователями
export const usersAPI = {
  // Получение профиля пользователя
  getProfile: () => {
    return fetchAPI('/users/profile');
  },
  
  // Обновление профиля пользователя
  updateProfile: (userData) => {
    return fetchAPI('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // Получение списка доноров
  getDonors: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/users/donors${query ? `?${query}` : ''}`);
  },
  
  // Получение списка реципиентов
  getRecipients: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/users/recipients${query ? `?${query}` : ''}`);
  },
  
  // Изменение пароля
  changePassword: (currentPassword, newPassword) => {
    return fetchAPI('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },
};

// API-методы для работы с запросами на донацию
export const donationRequestsAPI = {
  // Получение списка запросов
  getRequests: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/donation-requests${query ? `?${query}` : ''}`);
  },
  
  // Получение списка своих запросов
  getMyRequests: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/donation-requests/my${query ? `?${query}` : ''}`);
  },
  
  // Получение информации о запросе
  getRequest: (requestId) => {
    return fetchAPI(`/donation-requests/${requestId}`);
  },
  
  // Создание нового запроса
  createRequest: (requestData) => {
    return fetchAPI('/donation-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  
  // Обновление запроса
  updateRequest: (requestId, requestData) => {
    return fetchAPI(`/donation-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  },
  
  // Отмена запроса
  cancelRequest: (requestId) => {
    return fetchAPI(`/donation-requests/${requestId}`, {
      method: 'DELETE',
    });
  },
};

// API-методы для работы с донациями
export const donationsAPI = {
  // Получение списка донаций
  getDonations: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchAPI(`/donations${query ? `?${query}` : ''}`);
  },
  
  // Получение списка запланированных донаций
  getScheduledDonations: () => {
    return fetchAPI('/donations/scheduled');
  },
  
  // Получение информации о донации
  getDonation: (donationId) => {
    return fetchAPI(`/donations/${donationId}`);
  },
  
  // Создание новой донации
  createDonation: (donationData) => {
    return fetchAPI('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },
  
  // Завершение донации
  completeDonation: (donationId) => {
    return fetchAPI(`/donations/${donationId}/complete`, {
      method: 'PUT',
    });
  },
  
  // Отмена донации
  cancelDonation: (donationId) => {
    return fetchAPI(`/donations/${donationId}/cancel`, {
      method: 'PUT',
    });
  },
};

// API-методы для работы с центрами донации
export const donationCentersAPI = {
  // Получение списка центров
  getCenters: () => {
    return fetchAPI('/donation-centers');
  },
  
  // Получение информации о центре
  getCenter: (centerId) => {
    return fetchAPI(`/donation-centers/${centerId}`);
  },
};

export default {
  authAPI,
  usersAPI,
  donationRequestsAPI,
  donationsAPI,
  donationCentersAPI,
};