// src/components/Pages/JudicialRecoveryCard.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
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
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Статусы для взыскания
const statusOptions = [
  'В процессе',
  'Погашен',
  'Частично погашен',
  'Просрочен',
];

const providerOptions = [
  { value: 'ETHERNET', label: 'ETHERNET', organization: 'ООО "Объединенные сети"' },
  { value: 'LTE', label: 'LTE', organization: 'ООО "Объединенные сети"' },
  { value: 'TERRANET', label: 'Терранэт', organization: 'ООО "Терранэт"' },
  { value: 'HI', label: 'Хороший интернет', organization: 'ООО "Хороший интернет"' },
];

const bankOptions = ['Приорбанк', 'Беларусбанк', 'Белгазпромбанк', 'Банк ВТБ', 'Альфа-Банк', 'Другое'];

// Маппинг провайдеров с их полными названиями
const providerMap = {
  'ETHERNET': 'ООО "Объединенные сети" ETHERNET',
  'LTE': 'ООО "Объединенные сети" LTE',
  'TERRANET': 'ООО "Терранэт" Терранэт',
  'HI': 'ООО "Хороший интернет" ХИ',
};

const getProviderFullName = (providerValue) => {
  return providerMap[providerValue] || providerValue;
};

const getStatusColor = (status, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  switch(status) {
    case 'В процессе': 
      return { 
        bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', 
        color: '#2196f3' 
      };
    case 'Погашен': 
      return { 
        bg: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)', 
        color: '#4caf50' 
      };
    case 'Частично погашен': 
      return { 
        bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', 
        color: '#ff9800' 
      };
    case 'Просрочен': 
      return { 
        bg: isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)', 
        color: '#f44336' 
      };
    default: 
      return { 
        bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
        color: theme?.palette?.text?.primary || '#fff' 
      };
  }
};

// Данные взыскания (в реальном проекте - из API)
const recoveryData = {
  id: 1,
  name: 'ИВАНОВ ИВАН ИВАНОВИЧ',
  oldName: '',
  login: 'ivanov.i',
  amount: 125000,
  recovered: 45000,
  remaining: 80000,
  status: 'Частично погашен',
  phone: '+7 (999) 123-45-67',
  email: 'ivanov@mail.ru',
  provider: 'ETHERNET',
  providerFull: 'ООО "Объединенные сети" ETHERNET',
  contract: 'ОСЮ95/19LTE',
  contractDate: '19.05.2019',
  equipmentReturned: true,
  equipmentReturnDate: '20.06.2019',
  requirementSent: true,
  courtDate: '15.01.2025',
  paymentType: 'Банк',
  bank: 'Приорбанк', // Банк в информации о взыскании
  comment: 'Взыскание в процессе, ожидаем поступление средств',
  // Вкладка 1: Госпошлина
  gosposhlina: {
    compensationPercent: '100', // '100' или '50'
    paidAmount: 6000,
    paidDate: '10.01.2025',
    compensationAmount: 6000,
    compensationDate: '15.01.2025',
  },
  // Вкладка 2: Решение суда
  courtDecision: {
    gosposhlina: 6000,
    mainDebt: 125000,
    sanctions: 15000,
    equipmentFine: 5000,
    equipmentCompensation: 5000,
  },
  // Вкладка 3: Основной долг
  mainDebt: {
    amount: 125000,
    date: '19.05.2019',
  },
  // Вкладка 4: Санкции
  sanctions: {
    amount: 15000,
    date: '15.01.2025',
  },
  // Вкладка 5: Штраф за оборудование
  equipmentFine: {
    amount: 5000,
    date: '15.01.2025',
  },
  // Вкладка 6: Сумма возмещения стоимости марша
  equipmentCompensation: {
    amount: 5000,
    date: '15.01.2025',
  },
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const JudicialRecoveryCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const recoveryId = parseInt(id);

  const queryParams = new URLSearchParams(location.search);
  const modeFromUrl = queryParams.get('mode');
  
  const [mode, setMode] = useState(modeFromUrl === 'edit' ? 'edit' : 'view');
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState(recoveryData);
  const [originalData] = useState(recoveryData);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeFromUrl = queryParams.get('mode');
    setMode(modeFromUrl === 'edit' ? 'edit' : 'view');
  }, [location.search]);

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'provider') {
      updatedData.providerFull = getProviderFullName(value);
    }
    
    // Пересчет остатка при изменении суммы долга или взыскания
    if (field === 'amount' || field === 'recovered') {
      const amount = field === 'amount' ? value : formData.amount;
      const recovered = field === 'recovered' ? value : formData.recovered;
      updatedData.remaining = Math.max(0, amount - recovered);
      
      // Обновление статуса на основе остатка
      if (updatedData.remaining === 0) {
        updatedData.status = 'Погашен';
      } else if (updatedData.remaining > 0 && updatedData.remaining < amount) {
        updatedData.status = 'Частично погашен';
      } else if (updatedData.remaining === amount) {
        updatedData.status = 'В процессе';
      }
    }
    
    setFormData(updatedData);
  };

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  const handleSave = () => {
    setMode('view');
    navigate(`/judicial-recovery/${id}?mode=view`, { replace: true });
    setSnackbar({
      open: true,
      message: 'Данные сохранены успешно!',
      severity: 'success',
    });
  };

  const handleDelete = () => {
    setSnackbar({
      open: true,
      message: 'Взыскание удалено',
      severity: 'success',
    });
    setTimeout(() => navigate('/judicial-recovery'), 1000);
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
    setMode('view');
    navigate(`/judicial-recovery/${id}?mode=view`, { replace: true });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const statusColors = getStatusColor(formData.status, theme);

  if (!formData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          Взыскание не найдено
        </Typography>
      </Box>
    );
  }

  // Вспомогательная функция для рендеринга поля с суммой
  const renderAmountField = (label, value, field, section = null, type = 'amount') => {
    const isAmount = type === 'amount';
    const currentValue = section ? formData[section]?.[field] : formData[field];
    
    if (mode === 'edit') {
      return (
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
            {label}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={isAmount ? 'number' : 'text'}
            value={currentValue || ''}
            onChange={(e) => {
              if (section) {
                handleNestedChange(section, field, isAmount ? Number(e.target.value) : e.target.value);
              } else {
                handleChange(field, isAmount ? Number(e.target.value) : e.target.value);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isAmount ? 'secondary.main' : 'text.secondary',
                fontWeight: isAmount ? 600 : 'normal',
                fontSize: '1rem',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
              },
            }}
            InputProps={isAmount ? {
              endAdornment: <Typography sx={{ color: 'text.disabled', mr: 1 }}>₽</Typography>,
            } : {}}
          />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: isAmount ? 'secondary.main' : 'text.secondary',
          fontWeight: isAmount ? 600 : 'normal',
          fontSize: '1rem' 
        }}>
          {currentValue ? (isAmount ? currentValue.toLocaleString() : currentValue) : '-'} 
          {isAmount && ' ₽'}
        </Typography>
      </Box>
    );
  };

  const renderDateField = (label, value, field, section = null) => {
    const currentValue = section ? formData[section]?.[field] : formData[field];
    
    if (mode === 'edit') {
      return (
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
            {label}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={currentValue || ''}
            onChange={(e) => {
              if (section) {
                handleNestedChange(section, field, e.target.value);
              } else {
                handleChange(field, e.target.value);
              }
            }}
            placeholder="ДД.ММ.ГГГГ"
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
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          {currentValue || '-'}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/judicial-recovery')}
          sx={{ 
            color: 'text.secondary',
            mr: 2,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          {mode === 'edit' ? 'Редактирование' : 'Карточка взыскания'}
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
          {/* Основная информация - без изменений */}
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
                    onChange={(e) => handleChange('name', e.target.value.toUpperCase())}
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
                    {formData.amount.toLocaleString()} ₽
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Взыскано
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {formData.recovered.toLocaleString()} ₽
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Остаток
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: formData.remaining === 0 ? '#4caf50' : '#ff9800', 
                    fontWeight: 700 
                  }}>
                    {formData.remaining.toLocaleString()} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.9rem' }}>
                  Старая фамилия
                </Typography>
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
                  value={formData.provider}
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
                      helperText="Формат: +7 (XXX) XXX-XX-XX"
                      sx={{
                        '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                        '& .MuiInput-underline:before': { borderColor: 'divider' },
                        '& .MuiFormHelperText-root': { 
                          color: 'text.disabled',
                          fontSize: '0.75rem',
                        },
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

          {/* Информация о взыскании */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: 'block', mb: 2, fontSize: '0.9rem' }}>
              Информация о взыскании
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SendIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 120, fontSize: '0.9rem' }}>
                    Требование
                  </Typography>
                  {mode === 'edit' ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.requirementSent}
                          onChange={(e) => handleChange('requirementSent', e.target.checked)}
                          sx={{
                            color: 'text.disabled',
                            '&.Mui-checked': { color: 'secondary.main' },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>Отправлено</Typography>}
                    />
                  ) : (
                    <Chip
                      label={formData.requirementSent ? '✅ Отправлено' : '❌ Не отправлено'}
                      size="small"
                      sx={{
                        bgcolor: formData.requirementSent 
                          ? (isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)')
                          : (isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)'),
                        color: formData.requirementSent ? '#4caf50' : '#ff9800',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileCopyIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 120, fontSize: '0.9rem' }}>
                    Заочное решение
                  </Typography>
                  {mode === 'edit' ? (
                    <TextField
                      fullWidth
                      placeholder="ДД.ММ.ГГГГ"
                      value={formData.courtDate || ''}
                      onChange={(e) => handleChange('courtDate', e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInputBase-root': { color: 'text.secondary', fontSize: '1rem' },
                        '& .MuiInput-underline:before': { borderColor: 'divider' },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.courtDate}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 120, fontSize: '0.9rem' }}>
                    Тип оплаты
                  </Typography>
                  {mode === 'edit' ? (
                    <FormControl fullWidth variant="standard">
                      <Select
                        value={formData.paymentType || ''}
                        onChange={(e) => handleChange('paymentType', e.target.value)}
                        sx={{
                          color: 'text.primary',
                          fontSize: '1rem',
                          '& .MuiSelect-icon': { color: 'text.disabled' },
                          '&:before': { borderColor: 'divider' },
                          '&:hover:before': { borderColor: 'text.secondary' },
                          '&:after': { borderColor: 'secondary.main' },
                        }}
                      >
                        {['Банк', 'ЕРИП'].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.paymentType}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', minWidth: 120, fontSize: '0.9rem' }}>
                    Банк
                  </Typography>
                  {mode === 'edit' ? (
                    <FormControl fullWidth variant="standard">
                      <Select
                        value={formData.bank || ''}
                        onChange={(e) => handleChange('bank', e.target.value)}
                        sx={{
                          color: 'text.primary',
                          fontSize: '1rem',
                          '& .MuiSelect-icon': { color: 'text.disabled' },
                          '&:before': { borderColor: 'divider' },
                          '&:hover:before': { borderColor: 'text.secondary' },
                          '&:after': { borderColor: 'secondary.main' },
                        }}
                      >
                        {bankOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                      {formData.bank || '-'}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'divider', my: 1 }} />
          </Grid>

          {/* Вкладки с детальной информацией */}
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: 'text.secondary',
                    '&.Mui-selected': { color: 'secondary.main' },
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 2,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'secondary.main',
                  },
                }}
              >
                <Tab label="Госпошлина" />
                <Tab label="Решение суда" />
                <Tab label="Основной долг" />
                <Tab label="Санкции" />
                <Tab label="Штраф за оборудование" />
                <Tab label="Возмещение стоимости марша" />
              </Tabs>
            </Box>

            {/* Вкладка 1: Госпошлина */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.9rem' }}>
                      Возмещение
                    </Typography>
                    {mode === 'edit' ? (
                      <RadioGroup
                        row
                        value={formData.gosposhlina?.compensationPercent || '100'}
                        onChange={(e) => handleNestedChange('gosposhlina', 'compensationPercent', e.target.value)}
                      >
                        <FormControlLabel 
                          value="100" 
                          control={<Radio sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                          label={<Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>100%</Typography>} 
                        />
                        <FormControlLabel 
                          value="50" 
                          control={<Radio sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'secondary.main' } }} />} 
                          label={<Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>50%</Typography>} 
                        />
                      </RadioGroup>
                    ) : (
                      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                        {formData.gosposhlina?.compensationPercent === '100' ? '100%' : '50%'}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Уплачена', 'paidAmount', 'paidAmount', 'gosposhlina')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата оплаты', 'paidDate', 'paidDate', 'gosposhlina')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Возмещение', 'compensationAmount', 'compensationAmount', 'gosposhlina')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата возмещения', 'compensationDate', 'compensationDate', 'gosposhlina')}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Вкладка 2: Решение суда */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 600, mb: 2 }}>
                    Решение суда
                  </Typography>
                </Grid>
                {[
                  { label: 'Госпошлина', field: 'gosposhlina' },
                  { label: 'Основной долг', field: 'mainDebt' },
                  { label: 'Санкции', field: 'sanctions' },
                  { label: 'Штраф за оборудование', field: 'equipmentFine' },
                  { label: 'Сумма возмещения стоимости марша', field: 'equipmentCompensation' },
                ].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.field}>
                    {renderAmountField(item.label, item.field, item.field, 'courtDecision')}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Вкладка 3: Основной долг */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Сумма', 'amount', 'amount', 'mainDebt')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата', 'date', 'date', 'mainDebt')}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Вкладка 4: Санкции */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Сумма', 'amount', 'amount', 'sanctions')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата', 'date', 'date', 'sanctions')}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Вкладка 5: Штраф за оборудование */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Сумма', 'amount', 'amount', 'equipmentFine')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата', 'date', 'date', 'equipmentFine')}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Вкладка 6: Сумма возмещения стоимости марша */}
            <TabPanel value={tabValue} index={5}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {renderAmountField('Сумма', 'amount', 'amount', 'equipmentCompensation')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDateField('Дата', 'date', 'date', 'equipmentCompensation')}
                </Grid>
              </Grid>
            </TabPanel>
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
                rows={4}
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

export default JudicialRecoveryCard;