// src/components/Pages/DebtorCardPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  ContentCopy as ContentCopyIcon,
  Telegram as TelegramIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Данные должников (в реальном проекте - из API)
const debtorsData = [
  { 
    id: 1, 
    name: 'ИВАНОВ ИВАН ИВАНОВИЧ', 
    oldName: '',
    login: 'ivanov.i', 
    debt: 125000, 
    recovered: 0,
    status: 'Новый', 
    phone: '+375 (29) 123-45-67', 
    email: 'ivanov@mail.ru',
    socials: [{ type: 'telegram', value: '@ivanov' }],
    contract: 'ОСЮ95/19LTE',
    contractDate: '19.05.2019',
    provider: 'ETHERNET',
    providerFull: 'ООО "Объединенные сети" ETHERNET',
    equipmentReturned: true,
    equipmentReturnDate: '20.06.2019',
    requirementSent: false,
    transferredToLawyer: false,
    daysInWork: 15,
    comment: '',
  },
  { 
    id: 2, 
    name: 'ПЕТРОВ ПЕТР ПЕТРОВИЧ', 
    oldName: 'Петров П.П.',
    login: 'petrov.p', 
    debt: 78000, 
    recovered: 0,
    status: 'Новый', 
    phone: '+375 (29) 234-56-78', 
    email: 'petrov@mail.ru',
    socials: [],
    contract: 'ОСЮ95/20LTE',
    contractDate: '20.05.2020',
    provider: 'LTE',
    providerFull: 'ООО "Объединенные сети" LTE',
    equipmentReturned: false,
    equipmentReturnDate: '',
    requirementSent: false,
    transferredToLawyer: false,
    daysInWork: 5,
    comment: '',
  },
  { 
    id: 3, 
    name: 'СИДОРОВ СИДОР СИДОРОВИЧ', 
    oldName: '',
    login: 'sidorov.s', 
    debt: 230000, 
    recovered: 0,
    status: 'Новый', 
    phone: '+375 (29) 345-67-89', 
    email: 'sidorov@mail.ru',
    socials: [{ type: 'instagram', value: '@sidorov' }],
    contract: 'ОСЮ95/21LTE',
    contractDate: '21.05.2021',
    provider: 'TERRANET',
    providerFull: 'ООО "Терранэт" Терранэт',
    equipmentReturned: true,
    equipmentReturnDate: '22.06.2021',
    requirementSent: false,
    transferredToLawyer: false,
    daysInWork: 45,
    comment: '',
  },
  { 
    id: 4, 
    name: 'КОЗЛОВА АННА ИВАНОВНА', 
    oldName: 'Козлова А.И.',
    login: 'kozlova.a', 
    debt: 45000, 
    recovered: 0,
    status: 'Новый', 
    phone: '+375 (29) 456-78-90', 
    email: 'kozlova@mail.ru',
    socials: [],
    contract: 'ОСЮ95/22LTE',
    contractDate: '22.05.2022',
    provider: 'HI',
    providerFull: 'ООО "Хороший интернет" ХИ',
    equipmentReturned: false,
    equipmentReturnDate: '',
    requirementSent: false,
    transferredToLawyer: false,
    daysInWork: 120,
    comment: '',
  },
  { 
    id: 5, 
    name: 'МИХАЙЛОВ МИХАИЛ МИХАЙЛОВИЧ', 
    oldName: '',
    login: 'mikhailov.m', 
    debt: 152000, 
    recovered: 0,
    status: 'Новый', 
    phone: '+375 (29) 567-89-01', 
    email: 'mikhailov@mail.ru',
    socials: [{ type: 'whatsapp', value: '+375 (29) 567-89-01' }],
    contract: 'ОСЮ95/23LTE',
    contractDate: '23.05.2023',
    provider: 'ETHERNET',
    providerFull: 'ООО "Объединенные сети" ETHERNET',
    equipmentReturned: true,
    equipmentReturnDate: '24.06.2023',
    requirementSent: false,
    transferredToLawyer: false,
    daysInWork: 7,
    comment: '',
  },
];

// Список провайдеров для Select
const providerOptions = [
  { value: 'ETHERNET', label: 'ETHERNET', organization: 'ООО "Объединенные сети"' },
  { value: 'LTE', label: 'LTE', organization: 'ООО "Объединенные сети"' },
  { value: 'TERRANET', label: 'Терранэт', organization: 'ООО "Терранэт"' },
  { value: 'HI', label: 'Хороший интернет', organization: 'ООО "Хороший интернет"' },
];

// Опции соцсетей
const socialOptions = [
  { value: 'telegram', label: 'Telegram', icon: <TelegramIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon /> },
  { value: 'other', label: 'Другое', icon: <LinkIcon />, customLabel: true },
];

// Получение иконки для типа соцсети
const getSocialIcon = (type) => {
  const option = socialOptions.find(opt => opt.value === type);
  return option ? option.icon : <LinkIcon />;
};

const DebtorCardPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const debtorId = parseInt(id);
  
  // Получаем режим из URL параметра
  const queryParams = new URLSearchParams(location.search);
  const modeFromUrl = queryParams.get('mode');
  
  // Режим: 'view' или 'edit'
  const [mode, setMode] = useState(modeFromUrl === 'edit' ? 'edit' : 'view');
  
  // Сохраняем исходные данные для отмены
  const initialData = debtorsData.find(d => d.id === debtorId) || debtorsData[0];
  const [formData, setFormData] = useState(initialData);
  const [originalData] = useState(initialData);

  const [newSocialType, setNewSocialType] = useState('telegram');
  const [newSocialValue, setNewSocialValue] = useState('');
  const [newSocialCustomLabel, setNewSocialCustomLabel] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Маппинг провайдеров с их полными названиями
  const providerMap = {
    'ETHERNET': 'ООО "Объединенные сети" ETHERNET',
    'LTE': 'ООО "Объединенные сети" LTE',
    'TERRANET': 'ООО "Терранэт" Терранэт',
    'HI': 'ООО "Хороший интернет" ХИ',
  };

  // Получение полного названия провайдера
  const getProviderFullName = (providerValue) => {
    return providerMap[providerValue] || providerValue;
  };

  // Форматирование номера телефона
  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('375')) {
        cleaned = '+' + cleaned;
      } else if (cleaned.startsWith('80')) {
        cleaned = '+' + cleaned.replace('80', '375');
      } else {
        cleaned = '+375' + cleaned;
      }
    }
    
    if (cleaned.startsWith('+375')) {
      const digits = cleaned.replace('+375', '');
      let formatted = '+375';
      
      if (digits.length > 0) {
        formatted += ' (' + digits.substring(0, 2);
      }
      if (digits.length > 2) {
        formatted += ') ' + digits.substring(2, 5);
      }
      if (digits.length > 5) {
        formatted += '-' + digits.substring(5, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 9);
      }
      
      return formatted;
    }
    
    return cleaned;
  };

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    
    if (field === 'provider') {
      updatedData.providerFull = getProviderFullName(value);
    }
    
    if (field === 'phone') {
      updatedData.phone = formatPhoneNumber(value);
    }
    
    setFormData(updatedData);
  };

  const handleAddSocial = () => {
    if (newSocialValue.trim()) {
      let socialType = newSocialType;
      let socialLabel = getSocialLabel(newSocialType);
      
      if (newSocialType === 'other' && newSocialCustomLabel.trim()) {
        socialType = `custom_${newSocialCustomLabel.trim().toLowerCase().replace(/\s+/g, '_')}`;
        socialLabel = newSocialCustomLabel.trim();
      } else if (newSocialType === 'other') {
        setSnackbar({
          open: true,
          message: 'Пожалуйста, укажите название соцсети',
          severity: 'warning',
        });
        return;
      }
      
      setFormData({
        ...formData,
        socials: [...formData.socials, { 
          type: socialType, 
          value: newSocialValue.trim(),
          label: socialLabel 
        }]
      });
      setNewSocialValue('');
      setNewSocialType('telegram');
      setNewSocialCustomLabel('');
    }
  };

  const handleRemoveSocial = (index) => {
    setFormData({
      ...formData,
      socials: formData.socials.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: 'Данные сохранены успешно!',
      severity: 'success',
    });
    setMode('view');
  };

  const handleDelete = () => {
    setSnackbar({
      open: true,
      message: 'Должник удален',
      severity: 'success',
    });
    setTimeout(() => navigate('/debtors'), 1000);
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

  const getSocialLabel = (type) => {
    if (type.startsWith('custom_')) {
      const label = type.replace('custom_', '').replace(/_/g, ' ');
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    const option = socialOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // Переключение в режим редактирования
  const handleEdit = () => {
    setMode('edit');
  };

  // Отмена редактирования - восстанавливаем исходные данные
  const handleCancel = () => {
    setFormData(originalData);
    setMode('view');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/debtors')}
          sx={{ 
            color: 'text.secondary',
            mr: 2,
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          {mode === 'view' ? 'Карточка должника' : 'Редактирование'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip 
          label={formData.status}
          sx={{
            bgcolor: isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.1)',
            color: 'secondary.main',
            border: `1px solid ${isDark ? 'rgba(255,215,0,0.3)' : 'rgba(255,215,0,0.2)'}`,
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Дней в работе
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    {formData.daysInWork || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Общая сумма долга
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                    {formData.debt.toLocaleString()} ₽
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
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
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
                      placeholder="+375 (29) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      variant="standard"
                      helperText="Формат: +375 (XX) XXX-XX-XX"
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
              
              {/* Соцсети */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PublicIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Социальные сети
                  </Typography>
                </Box>
                
                {/* Список добавленных соцсетей */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {formData.socials.map((social, index) => {
                    const icon = getSocialIcon(social.type);
                    const label = social.label || getSocialLabel(social.type);
                    return (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        }}
                      >
                        <Box sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', minWidth: 100 }}>
                          {React.cloneElement(icon, { fontSize: 'small', sx: { mr: 0.5 } })}
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                            {label}:
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.primary', flex: 1 }}>
                          {social.value}
                        </Typography>
                        <Tooltip title={`Копировать ${label}`} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(social.value, label)}
                            sx={{ 
                              color: 'text.disabled',
                              '&:hover': { color: 'secondary.main' },
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {mode === 'edit' && (
                          <Tooltip title="Удалить" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveSocial(index)}
                              sx={{ 
                                color: 'text.disabled',
                                '&:hover': { color: '#f44336' },
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Добавление новой соцсети - только в режиме редактирования */}
                {mode === 'edit' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={newSocialType}
                          onChange={(e) => {
                            setNewSocialType(e.target.value);
                            if (e.target.value !== 'other') {
                              setNewSocialCustomLabel('');
                            }
                          }}
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                            '& .MuiSelect-icon': { color: 'text.disabled' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
                          }}
                        >
                          {socialOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {React.cloneElement(option.icon, { sx: { color: 'text.secondary' } })}
                                <Typography sx={{ ml: 0.5, color: 'text.primary' }}>{option.label}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {newSocialType === 'other' && (
                        <TextField
                          size="small"
                          placeholder="Название соцсети"
                          value={newSocialCustomLabel}
                          onChange={(e) => setNewSocialCustomLabel(e.target.value)}
                          sx={{
                            minWidth: 180,
                            '& .MuiOutlinedInput-root': {
                              color: 'text.secondary',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: 'divider' },
                              '&:hover fieldset': { borderColor: 'text.secondary' },
                              '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                            },
                          }}
                        />
                      )}
                      
                      <TextField
                        size="small"
                        placeholder="Контакт"
                        value={newSocialValue}
                        onChange={(e) => setNewSocialValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSocial()}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          '& .MuiOutlinedInput-root': {
                            color: 'text.secondary',
                            fontSize: '0.95rem',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'text.secondary' },
                            '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                          },
                        }}
                      />
                      <Tooltip title="Добавить соцсеть" arrow>
                        <IconButton 
                          onClick={handleAddSocial} 
                          sx={{ 
                            color: 'secondary.main',
                            '&:hover': { bgcolor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.08)' },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
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
                value={formData.comment}
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
              <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: formData.comment ? 'normal' : 'italic' }}>
                {formData.comment || 'Комментарий отсутствует'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Кнопки действий */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {mode === 'edit' ? (
          // Кнопки в режиме редактирования - только "Отмена" и "Сохранить" справа
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
              : snackbar.severity === 'warning'
                ? (isDark ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)')
                : (isDark ? 'rgba(244,67,54,0.2)' : 'rgba(244,67,54,0.1)'),
            color: snackbar.severity === 'success' 
              ? '#81c784' 
              : snackbar.severity === 'warning'
                ? '#ffb74d'
                : '#ef9a9a',
            border: `1px solid ${
              snackbar.severity === 'success' 
                ? 'rgba(76,175,80,0.3)'
                : snackbar.severity === 'warning'
                  ? 'rgba(255,152,0,0.3)'
                  : 'rgba(244,67,54,0.3)'
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

export default DebtorCardPage;