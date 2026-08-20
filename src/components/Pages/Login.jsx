// src/components/Pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff,
  PersonOutline,
  Lock,
  Gavel,
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { mode } = useThemeContext();
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация
    if (!credentials.login || !credentials.password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      // Имитация задержки для реалистичности
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Проверка логина и пароля
      const validLogin = credentials.login === 'admin';
      const validPassword = credentials.password === 'admin123';
      
      console.log('Login attempt:', credentials.login, credentials.password);
      console.log('Valid:', validLogin, validPassword);
      
      if (validLogin && validPassword) {
        // Сохраняем сессию
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ 
          login: credentials.login,
          name: 'Администратор'
        }));
        
        // Вызываем callback для обновления состояния в App
        if (onLogin) {
          onLogin();
        }
        
        // Перенаправляем на главную страницу
        navigate('/');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе в систему. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Определяем цвета для фокуса в зависимости от темы
  const focusColor = mode === 'dark' ? '#ffd700' : '#1a237e';
  const primaryColor = '#ffd700';
  const primaryDark = '#c4a000';

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mode === 'dark' ? '#0a0e1a' : '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Декоративный фон */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${mode === 'dark' ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.05)'}, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${mode === 'dark' ? 'rgba(255,215,0,0.05)' : 'rgba(26,35,126,0.05)'}, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* JUDEX логотип в левом верхнем углу */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: 40,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px rgba(255, 215, 0, 0.4)`,
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.05)',
                boxShadow: `0 6px 30px rgba(255, 215, 0, 0.5)`,
              },
            }}
          >
            <Gavel sx={{ color: '#1a237e', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: primaryColor,
                letterSpacing: '2px',
                lineHeight: 1,
                textShadow: mode === 'dark' 
                  ? '0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.1)' 
                  : '0 0 20px rgba(255, 215, 0, 0.2)',
              }}
            >
              JUDEX
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                fontWeight: 300,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
                display: 'block',
                mt: 0.5,
              }}
            >
              Система контроля должников
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{
            width: '60%',
            borderColor: primaryColor,
            borderWidth: 2,
            borderRadius: 1,
            opacity: 0.7,
            boxShadow: mode === 'dark' ? '0 0 20px rgba(255,215,0,0.2)' : 'none',
          }}
        />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 420,
          width: '100%',
          borderRadius: 3,
          backgroundColor: mode === 'dark' ? '#141b2d' : '#ffffff',
          position: 'relative',
          zIndex: 1,
          backdropFilter: mode === 'dark' ? 'blur(10px)' : 'none',
          border: mode === 'dark' ? '1px solid rgba(255,215,0,0.1)' : 'none',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
          }}
        >
          Вход в JUDEX
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 4,
          }}
        >
          Войдите в систему для управления должниками
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Логин"
            name="login"
            value={credentials.login}
            onChange={handleChange}
            variant="outlined"
            disabled={loading}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255,215,0,0.6)' : 'rgba(26,35,126,0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: focusColor,
                  borderWidth: 2,
                },
                '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
                  color: focusColor,
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: focusColor,
                },
              },
            }}
            autoComplete="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline 
                    sx={{ 
                      color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      transition: 'color 0.2s ease',
                    }} 
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            onChange={handleChange}
            variant="outlined"
            disabled={loading}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255,215,0,0.6)' : 'rgba(26,35,126,0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: focusColor,
                  borderWidth: 2,
                },
                '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
                  color: focusColor,
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: focusColor,
                },
              },
            }}
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock 
                    sx={{ 
                      color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      transition: 'color 0.2s ease',
                    }} 
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    disabled={loading}
                    sx={{
                      color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        color: focusColor,
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: primaryColor,
              color: '#1a237e',
              '&:hover': {
                bgcolor: primaryDark,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 25px rgba(255, 215, 0, 0.5)',
              },
              '&:disabled': {
                bgcolor: primaryColor,
                opacity: 0.6,
                color: '#1a237e',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Вход...' : 'ВОЙТИ'}
          </Button>
        </form>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: 'block',
            mt: 3,
            color: 'text.secondary',
            fontSize: '0.7rem',
          }}
        >
          Для тестового входа используйте:<br />
          Логин: admin / Пароль: admin123
        </Typography>
      </Paper>

      {/* Footer с версией */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'text.secondary',
          opacity: 0.4,
          fontSize: '0.6rem',
          letterSpacing: '1px',
          zIndex: 1,
        }}
      >
        JUDEX v1.0.0 © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Login;