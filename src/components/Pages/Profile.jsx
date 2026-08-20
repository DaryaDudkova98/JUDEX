// src/components/Pages/Profile.jsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Badge,
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Администратор',
    position: 'Системный администратор',
    department: 'IT-отдел',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSave = () => {
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: 'Профиль успешно обновлен!',
      severity: 'success',
    });
  };

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Проверка размера файла (макс 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Размер файла не должен превышать 2 МБ',
          severity: 'error',
        });
        return;
      }
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Пожалуйста, выберите изображение',
          severity: 'error',
        });
        return;
      }
      
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setSnackbar({
        open: true,
        message: 'Аватар успешно загружен!',
        severity: 'success',
      });
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSnackbar({
      open: true,
      message: 'Аватар удален',
      severity: 'success',
    });
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            👤 Профиль
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Управление личной информацией
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.primary' },
                }}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  bgcolor: 'secondary.main',
                  color: isDark ? '#0d1445' : '#1a1a2e',
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: 'secondary.main',
                color: isDark ? '#0d1445' : '#1a1a2e',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              Редактировать
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Основная информация с аватаром */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      bgcolor: 'secondary.main',
                      color: isDark ? '#0d1445' : '#1a1a2e',
                      width: 36,
                      height: 36,
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    bgcolor: avatarPreview ? 'transparent' : 'secondary.main',
                    color: isDark ? '#0d1445' : '#1a1a2e',
                    fontSize: '3rem',
                    fontWeight: 600,
                    mb: 2,
                    border: avatarPreview ? '3px solid #ffd700' : 'none',
                  }}
                >
                  {!avatarPreview && profileData.name.charAt(0)}
                </Avatar>
              </Badge>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </Box>
            
            {avatarPreview && (
              <Button
                size="small"
                onClick={handleRemoveAvatar}
                sx={{
                  color: '#f44336',
                  fontSize: '0.75rem',
                  mt: 1,
                  '&:hover': { bgcolor: 'rgba(244,67,54,0.1)' },
                }}
              >
                Удалить аватар
              </Button>
            )}
            
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, mt: 1 }}>
              {profileData.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {profileData.position}
            </Typography>
            <Chip
              label="Активен"
              size="small"
              sx={{
                mt: 1,
                bgcolor: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)',
                color: '#4caf50',
                border: `1px solid ${isDark ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)'}`,
              }}
            />
            
            <Divider sx={{ my: 2, borderColor: 'divider' }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WorkIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {profileData.department}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Редактируемая информация */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Личная информация
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ФИО"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                  sx={{
                    '& .MuiInputBase-root': {
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Должность"
                  value={profileData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                  sx={{
                    '& .MuiInputBase-root': {
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Отдел/Подразделение"
                  value={profileData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                  sx={{
                    '& .MuiInputBase-root': {
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Безопасность */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Безопасность
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => navigate('/settings')}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'text.primary' },
                  }}
                >
                  Сменить пароль
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  sx={{
                    bgcolor: '#f44336',
                    color: '#fff',
                    '&:hover': { bgcolor: '#d32f2f' },
                  }}
                >
                  Выйти из всех устройств
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' 
              ? (isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)')
              : (isDark ? 'rgba(244,67,54,0.2)' : 'rgba(244,67,54,0.1)'),
            color: snackbar.severity === 'success' ? '#81c784' : '#ef9a9a',
            border: `1px solid ${snackbar.severity === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;