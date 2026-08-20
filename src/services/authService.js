// src/services/authService.js
// Сервис для работы с аутентификацией

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем класс для обработки ошибок API
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const authService = {
  // Вход в систему
  async login(login, password) {
    try {
      // Реальный запрос к API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      // Обрабатываем ошибки ответа
      if (!response.ok) {
        let errorMessage = 'Ошибка авторизации';
        let errorData = null;
        
        try {
          errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Если не удалось распарсить JSON
          if (response.status === 401) {
            errorMessage = 'Неверный логин или пароль';
          } else if (response.status === 404) {
            errorMessage = 'Сервер не найден. Проверьте подключение.';
          } else if (response.status >= 500) {
            errorMessage = 'Ошибка сервера. Попробуйте позже.';
          }
        }
        
        throw new ApiError(errorMessage, response.status, errorData);
      }

      const data = await response.json();
      
      // Проверяем наличие необходимых данных
      if (!data.token) {
        throw new ApiError('Не получен токен авторизации', 400, data);
      }
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(data.user || { login, name: login }));
      localStorage.setItem('isAuthenticated', 'true');
      
      return data;
    } catch (error) {
      // Если ошибка уже является ApiError, пробрасываем её
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Обрабатываем сетевые ошибки
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new ApiError('Не удалось подключиться к серверу. Проверьте интернет-соединение.', 0, null);
      }
      
      console.error('Login error:', error);
      throw new ApiError('Ошибка при входе в систему', 500, null);
    }
  },

  // Выход из системы
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Проверка аутентификации
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem('token');
  },

  // Получение текущего пользователя
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Получение токена
  getToken() {
    return localStorage.getItem('token');
  },

  // Обновление токена
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new ApiError('Нет refresh токена', 401, null);
      }

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        let errorMessage = 'Не удалось обновить токен';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
        throw new ApiError(errorMessage, response.status, null);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      return data.token;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Refresh token error:', error);
      throw new ApiError('Ошибка обновления токена', 500, null);
    }
  },

  // Проверка валидности токена
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Пробуем обновить токен
          try {
            await this.refreshToken();
            return true;
          } catch (e) {
            this.logout();
            return false;
          }
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Validate token error:', error);
      return false;
    }
  },

  // Регистрация нового пользователя (опционально)
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка регистрации';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
        throw new ApiError(errorMessage, response.status, null);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Register error:', error);
      throw new ApiError('Ошибка регистрации', 500, null);
    }
  },

  // Сброс пароля (опционально)
  async resetPassword(email) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка сброса пароля';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
        throw new ApiError(errorMessage, response.status, null);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Reset password error:', error);
      throw new ApiError('Ошибка сброса пароля', 500, null);
    }
  },
};

// Хук для использования в компонентах
export const useAuth = () => {
  return {
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),
    getToken: authService.getToken.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    validateToken: authService.validateToken.bind(authService),
    register: authService.register.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
  };
};