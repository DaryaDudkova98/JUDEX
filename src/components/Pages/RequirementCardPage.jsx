// src/components/Pages/RequirementCardPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Gavel as GavelIcon,
  Send as SendIcon,
  FileCopy as FileCopyIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Убираем "Ожидается ответ" из списка статусов
const statusOptions = [
  'Ожидается отправка',
  'Требование отправлено',
];

// Список провайдеров для Select (как в DebtorCardPage)
const providerOptions = [
  { value: 'ETHERNET', label: 'ETHERNET', organization: 'ООО "Объединенные сети"' },
  { value: 'LTE', label: 'LTE', organization: 'ООО "Объединенные сети"' },
  { value: 'TERRANET', label: 'Терранэт', organization: 'ООО "Терранэт"' },
  { value: 'HI', label: 'Хороший интернет', organization: 'ООО "Хороший интернет"' },
];

// Маппинг провайдеров с их полными названиями
const providerMap = {
  'ETHERNET': 'ООО "Объединенные сети" ETHERNET',
  'LTE': 'ООО "Объединенные сети" LTE',
  'TERRANET': 'ООО "Терранэт" Терранэт',
  'HI': 'ООО "Хороший интернет" ХИ',
};

const getStatusColor = (status, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  switch(status) {
    case 'Ожидается отправка': 
      return { 
        bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', 
        color: '#ff9800' 
      };
    case 'Требование отправлено': 
      return { 
        bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', 
        color: '#2196f3' 
      };
    default: 
      return { 
        bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
        color: theme?.palette?.text?.primary || '#fff' 
      };
  }
};

// Данные требований (в реальном проекте - из API)
const requirementsData = [
  { 
    id: 1, 
    name: 'Иванов Иван Иванович', 
    oldName: '',
    login: 'ivanov.i', 
    debt: 125000, 
    status: 'Требование отправлено',
    dateSent: '15.01.2025',
    comment: 'Должник на связи, обещал оплатить',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@mail.ru',
    provider: 'ETHERNET',
    providerFull: 'ООО "Объединенные сети" ETHERNET',
    contract: 'ОСЮ95/19LTE',
    contractDate: '19.05.2019',
    equipmentReturned: true,
    equipmentReturnDate: '20.06.2019',
  },
  { 
    id: 2, 
    name: 'Петров Петр Петрович', 
    oldName: 'Петров П.П.',
    login: 'petrov.p', 
    debt: 78000, 
    status: 'Ожидается отправка',
    dateSent: '-',
    comment: 'Должник не отвечает',
    phone: '+7 (999) 234-56-78',
    email: 'petrov@mail.ru',
    provider: 'LTE',
    providerFull: 'ООО "Объединенные сети" LTE',
    contract: 'ОСЮ95/20LTE',
    contractDate: '20.05.2020',
    equipmentReturned: false,
    equipmentReturnDate: '',
  },
  { 
    id: 3, 
    name: 'Сидоров Сидор Сидорович', 
    oldName: '',
    login: 'sidorov.s', 
    debt: 230000, 
    status: 'Ожидается отправка',
    dateSent: '-',
    comment: 'Изучается возможность оплаты госпошлины',
    phone: '+7 (999) 345-67-89',
    email: 'sidorov@mail.ru',
    provider: 'TERRANET',
    providerFull: 'ООО "Терранэт" Терранэт',
    contract: 'ОСЮ95/21LTE',
    contractDate: '21.05.2021',
    equipmentReturned: true,
    equipmentReturnDate: '22.06.2021',
  },
  { 
    id: 4, 
    name: 'Козлова Анна Ивановна', 
    oldName: 'Козлова А.И.',
    login: 'kozlova.a', 
    debt: 45000, 
    status: 'Требование отправлено',
    dateSent: '08.01.2025',
    comment: 'Ведутся переговоры о рассрочке',
    phone: '+7 (999) 456-78-90',
    email: 'kozlova@mail.ru',
    provider: 'HI',
    providerFull: 'ООО "Хороший интернет" ХИ',
    contract: 'ОСЮ95/22LTE',
    contractDate: '22.05.2022',
    equipmentReturned: false,
    equipmentReturnDate: '',
  },
  { 
    id: 5, 
    name: 'Михайлов Михаил Михайлович', 
    oldName: '',
    login: 'mikhailov.m', 
    debt: 152000, 
    status: 'Требование отправлено',
    dateSent: '05.01.2025',
    comment: 'Ждем ответа до 20.01.2025',
    phone: '+7 (999) 567-89-01',
    email: 'mikhailov@mail.ru',
    provider: 'ETHERNET',
    providerFull: 'ООО "Объединенные сети" ETHERNET',
    contract: 'ОСЮ95/23LTE',
    contractDate: '23.05.2023',
    equipmentReturned: true,
    equipmentReturnDate: '24.06.2023',
  },
];

const RequirementCardPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const requirementId = parseInt(id);

  // Получаем режим из URL параметра
  const queryParams = new URLSearchParams(location.search);
  const modeFromUrl = queryParams.get('mode');
  
  // Режим: 'view' или 'edit'
  const [mode, setMode] = useState(modeFromUrl === 'edit' ? 'edit' : 'view');
  
  // Сохраняем исходные данные для отмены
  const initialData = requirementsData.find(r => r.id === requirementId) || requirementsData[0];
  const [formData, setFormData] = useState(initialData);
  const [originalData] = useState(initialData);

  const [dateError, setDateError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Получение полного названия провайдера
  const getProviderFullName = (providerValue) => {
    return providerMap[providerValue] || providerValue;
  };

  // Обновляем режим при изменении URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeFromUrl = queryParams.get('mode');
    setMode(modeFromUrl === 'edit' ? 'edit' : 'view');
  }, [location.search]);

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    
    // Если меняется провайдер - обновляем полное название
    if (field === 'provider') {
      updatedData.providerFull = getProviderFullName(value);
    }
    
    // Если меняется статус
    if (field === 'status') {
      // Если статус "Ожидается отправка" - дата становится "-"
      if (value === 'Ожидается отправка') {
        updatedData.dateSent = '-';
        setDateError(false);
      }
      // Если статус "Требование отправлено" - проверяем дату
      else if (value === 'Требование отправлено') {
        // Если дата пустая или "-", устанавливаем текущую дату
        if (!updatedData.dateSent || updatedData.dateSent === '-') {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          updatedData.dateSent = `${day}.${month}.${year}`;
        }
        setDateError(false);
      }
    }
    
    // Если меняется дата
    if (field === 'dateSent') {
      // Если статус "Требование отправлено" и дата пустая - ошибка
      if (formData.status === 'Требование отправлено' && !value.trim()) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    }
    
    setFormData(updatedData);
  };

  const handleSave = () => {
    // Проверка: если статус "Требование отправлено" и дата пустая
    if (formData.status === 'Требование отправлено' && (!formData.dateSent || formData.dateSent === '-')) {
      setDateError(true);
      setSnackbar({
        open: true,
        message: 'Для статуса "Требование отправлено" необходимо указать дату отправки!',
        severity: 'error',
      });
      return;
    }
    
    // Переключаемся в режим просмотра
    setMode('view');
    navigate(`/requirements/${id}?mode=view`, { replace: true });
    
    setSnackbar({
      open: true,
      message: 'Данные сохранены успешно!',
      severity: 'success',
    });
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({
        open: true,
        message: `${label} скопировано в буфер обмена!`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Ошибка при копировании',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setDateError(false);
    setMode('view');
    navigate(`/requirements/${id}?mode=view`, { replace: true });
  };

  const statusColors = getStatusColor(formData.status, theme);
  
  // Определяем, должно ли поле даты быть disabled
  const isDateDisabled = formData.status === 'Ожидается отправка';

  // Проверяем, есть ли данные
  if (!formData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          Требование не найдено
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок с кнопкой назад */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/requirements')}
          sx={{ 
            color: 'text.secondary',
            mr: 2,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          {mode === 'edit' ? 'Редактирование' : 'Карточка требования'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip
          label={mode === 'edit' ? 'Режим редактирования' : 'Режим просмотра'}
          size="small"
          sx={{
            bgcolor: mode === 'edit' 
              ? (isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)')
              : (isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.12)'),
            color: mode === 'edit' ? '#ffd700' : '#4caf50',
            fontWeight: 500,
            mr: 2,
          }}
        />
        <Chip
          label={formData.status}
          sx={{
            bgcolor: statusColors.bg,
            color: statusColors.color,
            border: `1px solid ${statusColors.color}30`,
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        />
      </Box>

      <Paper sx={{ 
        p: 4, 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
        <Grid container spacing={3}>
          {/* Основная информация */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                    ФИО
                  </Typography>
                  <Tooltip title="Копировать ФИО" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(formData.name, 'ФИО')}
                      sx={{ 
                        color: 'text.disabled',
                        '&:hover': { color: 'secondary.main' },
                        mb: 0.5,
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                {mode === 'edit' ? (
                  <TextField
                    fullWidth
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-root': { color: 'text.primary', fontSize: '1.3rem', fontWeight: 600 },
                      '& .MuiInput-underline:before': { borderColor: 'divider' },
                      '& .MuiInput-underline:hover:before': { borderColor: 'text.secondary' },
                      '& .MuiInput-underline:after': { borderColor: 'secondary.main' },
                    }}
                  />
                ) : (
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {formData.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 4, ml: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Сумма долга
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                    {formData.debt.toLocaleString()} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                    Старая фамилия
                  </Typography>
                </Box>
                {mode === 'edit' ? (
                  <TextField
                    fullWidth
                    value={formData.oldName || ''}
                    onChange={(e) => handleChange('oldName', e.target.value)}
                    variant="standard"
                    placeholder="—"
                    sx={{
                      '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                      '& .MuiInput-underline:before': { borderColor: 'divider' },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {formData.oldName || '—'}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                    Логин
                  </Typography>
                  <Tooltip title="Копировать логин" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(formData.login, 'Логин')}
                      sx={{ 
                        color: 'text.disabled',
                        '&:hover': { color: 'secondary.main' },
                        mb: 0.5,
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                {mode === 'edit' ? (
                  <TextField
                    fullWidth
                    value={formData.login}
                    onChange={(e) => handleChange('login', e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                      '& .MuiInput-underline:before': { borderColor: 'divider' },
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {formData.login}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Контракт */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                Контракт
              </Typography>
              <Tooltip title="Копировать контракт" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(formData.contract, 'Контракт')}
                  sx={{ 
                    color: 'text.disabled',
                    '&:hover': { color: 'secondary.main' },
                    mb: 0.5,
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                value={formData.contract}
                onChange={(e) => handleChange('contract', e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInputBase-root': { color: 'text.primary', fontWeight: 500, fontSize: '1rem' },
                  '& .MuiInput-underline:before': { borderColor: 'divider' },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {formData.contract}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
              Дата контракта
            </Typography>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                value={formData.contractDate}
                onChange={(e) => handleChange('contractDate', e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                  '& .MuiInput-underline:before': { borderColor: 'divider' },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {formData.contractDate}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Провайдер */}
          <Grid item xs={12} sm={6}>
            {mode === 'edit' ? (
              <FormControl fullWidth variant="standard">
                <InputLabel 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                    '&.Mui-focused': { color: 'secondary.main' },
                  }}
                >
                  Провайдер
                </InputLabel>
                <Select
                  value={formData.provider || ''}
                  onChange={(e) => handleChange('provider', e.target.value)}
                  label="Провайдер"
                  sx={{
                    color: 'text.primary',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '& .MuiSelect-icon': { color: 'text.disabled' },
                    '&:before': { borderColor: 'divider' },
                    '&:hover:before': { borderColor: 'text.secondary' },
                    '&:after': { borderColor: 'secondary.main' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        '& .MuiMenuItem-root': {
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'action.hover' },
                          '&.Mui-selected': {
                            bgcolor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.08)',
                            color: 'secondary.main',
                          },
                        },
                      },
                    },
                  }}
                >
                  {providerOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {option.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
                          {option.organization}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                  Провайдер
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {formData.provider}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Пустой Grid для выравнивания */}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Отображение выбранного провайдера с полным названием */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255,215,0,0.05)' : 'rgba(255,215,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.08)'}`,
            }}>
              <BusinessIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                Выбранный провайдер:
              </Typography>
              <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 600, fontSize: '0.95rem' }}>
                {formData.providerFull}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Оборудование */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.9rem' }}>
                Оборудование
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {mode === 'edit' ? (
                  <>
                    <RadioGroup
                      row
                      value={formData.equipmentReturned ? 'returned' : 'not_returned'}
                      onChange={(e) => handleChange('equipmentReturned', e.target.value === 'returned')}
                    >
                      <FormControlLabel 
                        value="returned" 
                        control={<Radio sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                        label={<Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>Вернул</Typography>} 
                      />
                      <FormControlLabel 
                        value="not_returned" 
                        control={<Radio sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                        label={<Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>Не вернул</Typography>} 
                      />
                    </RadioGroup>
                    {formData.equipmentReturned && (
                      <TextField
                        size="small"
                        placeholder="Дата возврата"
                        value={formData.equipmentReturnDate}
                        onChange={(e) => handleChange('equipmentReturnDate', e.target.value)}
                        sx={{
                          width: 150,
                          '& .MuiOutlinedInput-root': {
                            color: 'text.secondary',
                            fontSize: '0.95rem',
                            '& fieldset': { borderColor: 'divider' },
                          },
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={formData.equipmentReturned ? '✅ Вернул' : '❌ Не вернул'}
                      size="small"
                      sx={{
                        bgcolor: formData.equipmentReturned 
                          ? (isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)')
                          : (isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)'),
                        color: formData.equipmentReturned ? '#4caf50' : '#f44336',
                        fontWeight: 500,
                      }}
                    />
                    {formData.equipmentReturned && formData.equipmentReturnDate && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Дата возврата: {formData.equipmentReturnDate}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Контактная информация */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'block', mb: 2, fontSize: '0.9rem' }}>
              Контактная информация
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  {mode === 'edit' ? (
                    <TextField
                      fullWidth
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                        '& .MuiInput-underline:before': { borderColor: 'divider' },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.phone}
                    </Typography>
                  )}
                  <Tooltip title="Копировать телефон" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(formData.phone, 'Телефон')}
                      sx={{ 
                        color: 'text.disabled',
                        '&:hover': { color: 'secondary.main' },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  {mode === 'edit' ? (
                    <TextField
                      fullWidth
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                        '& .MuiInput-underline:before': { borderColor: 'divider' },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.email}
                    </Typography>
                  )}
                  <Tooltip title="Копировать email" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(formData.email, 'Email')}
                      sx={{ 
                        color: 'text.disabled',
                        '&:hover': { color: 'secondary.main' },
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Информация о требовании */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'block', mb: 2, fontSize: '0.9rem' }}>
              Информация о требовании
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SendIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 100, fontSize: '0.9rem' }}>
                    Дата отправки
                  </Typography>
                  {mode === 'edit' ? (
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        placeholder={isDateDisabled ? 'Не требуется' : 'ДД.ММ.ГГГГ'}
                        value={formData.dateSent || ''}
                        onChange={(e) => handleChange('dateSent', e.target.value)}
                        disabled={isDateDisabled}
                        variant="standard"
                        error={dateError}
                        sx={{
                          '& .MuiInputBase-root': { 
                            color: isDateDisabled ? 'text.disabled' : 'text.secondary', 
                            fontSize: '1rem' 
                          },
                          '& .MuiInput-underline:before': { borderColor: 'divider' },
                          '& .MuiInput-underline:hover:before': { 
                            borderColor: isDateDisabled ? 'divider' : 'text.secondary' 
                          },
                          '& .MuiInput-underline:after': { borderColor: 'secondary.main' },
                        }}
                      />
                      {dateError && (
                        <FormHelperText error sx={{ fontSize: '0.75rem' }}>
                          Обязательное поле для статуса "Требование отправлено"
                        </FormHelperText>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.dateSent}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileCopyIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 100, fontSize: '0.9rem' }}>
                    Статус
                  </Typography>
                  {mode === 'edit' ? (
                    <FormControl fullWidth variant="standard">
                      <Select
                        value={formData.status || ''}
                        onChange={(e) => handleChange('status', e.target.value)}
                        sx={{
                          color: 'text.primary',
                          fontSize: '1rem',
                          '& .MuiSelect-icon': { color: 'text.disabled' },
                          '&:before': { borderColor: 'divider' },
                          '&:hover:before': { borderColor: 'text.secondary' },
                          '&:after': { borderColor: 'secondary.main' },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                              '& .MuiMenuItem-root': {
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'action.hover' },
                                '&.Mui-selected': {
                                  bgcolor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.08)',
                                  color: 'secondary.main',
                                },
                              },
                            },
                          },
                        }}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      label={formData.status}
                      size="small"
                      sx={{
                        bgcolor: statusColors.bg,
                        color: statusColors.color,
                        border: `1px solid ${statusColors.color}30`,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Комментарий */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.9rem' }}>
              Комментарий
            </Typography>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={formData.comment || ''}
                onChange={(e) => handleChange('comment', e.target.value)}
                placeholder="Введите комментарий..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'text.secondary',
                    fontSize: '1rem',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                  },
                }}
              />
            ) : (
              <Paper sx={{ 
                p: 2, 
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                minHeight: 80,
              }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: formData.comment ? 'normal' : 'italic' }}>
                  {formData.comment || 'Комментарий отсутствует'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Кнопки действий */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {mode === 'edit' ? (
          // Кнопки в режиме редактирования - только "Отмена" и "Сохранить"
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'text.primary' },
                fontSize: '0.95rem',
                px: 3,
                py: 1,
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
                fontSize: '0.95rem',
                px: 3,
                py: 1,
              }}
            >
              Сохранить
            </Button>
          </Box>
        ) : (
          // В режиме просмотра - пустой блок (только стрелочка назад)
          <Box />
        )}
      </Box>

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
              : snackbar.severity === 'error'
                ? (isDark ? 'rgba(244,67,54,0.2)' : 'rgba(244,67,54,0.1)')
                : (isDark ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)'),
            color: snackbar.severity === 'success' 
              ? '#81c784' 
              : snackbar.severity === 'error'
                ? '#ef9a9a'
                : '#ffb74d',
            border: `1px solid ${
              snackbar.severity === 'success' 
                ? 'rgba(76,175,80,0.3)'
                : snackbar.severity === 'error'
                  ? 'rgba(244,67,54,0.3)'
                  : 'rgba(255,152,0,0.3)'
            }`,
            fontSize: '0.95rem',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequirementCardPage;