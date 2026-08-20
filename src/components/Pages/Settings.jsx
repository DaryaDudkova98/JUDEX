// src/components/Pages/Settings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  // Состояния для формы
  const [login, setLogin] = useState('admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Состояния для сообщений
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleSaveLogin = () => {
    setMessage('Логин успешно изменен!');
    setMessageType('success');
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают!');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('Пароль должен содержать минимум 6 символов!');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    setMessage('Пароль успешно изменен!');
    setMessageType('success');
    setTimeout(() => {
      setMessage('');
    }, 3000);
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Стили для Paper
  const paperSx = {
    p: 3,
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  };

  // Стили для Avatar
  const avatarSx = {
    bgcolor: isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.1)',
    color: 'secondary.main',
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            ⚙️ Настройки
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Управление учетной записью
          </Typography>
        </Box>
      </Box>

      {/* Сообщение об успехе/ошибке */}
      {message && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: messageType === 'success' 
              ? (isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)')
              : (isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)'),
            border: `1px solid ${messageType === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
            color: messageType === 'success' ? '#81c784' : '#ef9a9a',
          }}
        >
          <Typography variant="body2">
            {messageType === 'success' ? '✅ ' : '❌ '}
            {message}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Изменение логина */}
        <Grid item xs={12} md={6}>
          <Paper sx={paperSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={avatarSx}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Изменить логин
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'divider', mb: 3 }} />

            <TextField
              fullWidth
              label="Новый логин"
              variant="outlined"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'secondary.main' },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveLogin}
                sx={{
                  bgcolor: 'secondary.main',
                  color: '#0d1445',
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.primary' },
                }}
              >
                Отмена
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Изменение пароля */}
        <Grid item xs={12} md={6}>
          <Paper sx={paperSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={avatarSx}>
                <LockIcon />
              </Avatar>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Изменить пароль
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'divider', mb: 3 }} />

            <TextField
              fullWidth
              label="Текущий пароль"
              type={showCurrentPassword ? 'text' : 'password'}
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'secondary.main' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Новый пароль"
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'secondary.main' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Подтверждение пароля"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'text.secondary' },
                  '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': { color: 'secondary.main' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePassword}
                sx={{
                  bgcolor: 'secondary.main',
                  color: '#0d1445',
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.primary' },
                }}
              >
                Очистить
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;