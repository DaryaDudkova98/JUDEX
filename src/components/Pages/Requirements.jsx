// src/components/Pages/Requirements.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Popover,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Gavel as GavelIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  FileCopy as FileCopyIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  ContentCopy as ContentCopyIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Начальные данные - должники, по которым отправлены требования
const initialRequirements = [
  { 
    id: 1, 
    name: 'Иванов Иван Иванович', 
    login: 'ivanov.i', 
    debt: 125000, 
    status: 'Требование отправлено',
    dateSent: '15.01.2025',
    comment: 'Должник на связи, обещал оплатить',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@mail.ru',
    provider: 'ООО "Объединенные сети" ETHERNET',
  },
  { 
    id: 2, 
    name: 'Петров Петр Петрович', 
    login: 'petrov.p', 
    debt: 78000, 
    status: 'Ожидается ответ',
    dateSent: '12.01.2025',
    comment: 'Должник не отвечает',
    phone: '+7 (999) 234-56-78',
    email: 'petrov@mail.ru',
    provider: 'ООО "Объединенные сети" LTE',
  },
  { 
    id: 3, 
    name: 'Сидоров Сидор Сидорович', 
    login: 'sidorov.s', 
    debt: 230000, 
    status: 'Ожидается отправка',
    dateSent: '-',
    comment: 'Изучается возможность оплаты госпошлины',
    phone: '+7 (999) 345-67-89',
    email: 'sidorov@mail.ru',
    provider: 'ООО "Терранэт" Терранэт',
  },
  { 
    id: 4, 
    name: 'Козлова Анна Ивановна', 
    login: 'kozlova.a', 
    debt: 45000, 
    status: 'Требование отправлено',
    dateSent: '08.01.2025',
    comment: 'Ведутся переговоры о рассрочке',
    phone: '+7 (999) 456-78-90',
    email: 'kozlova@mail.ru',
    provider: 'ООО "Хороший интернет" ХИ',
  },
  { 
    id: 5, 
    name: 'Михайлов Михаил Михайлович', 
    login: 'mikhailov.m', 
    debt: 152000, 
    status: 'Ожидается ответ',
    dateSent: '05.01.2025',
    comment: 'Ждем ответа до 20.01.2025',
    phone: '+7 (999) 567-89-01',
    email: 'mikhailov@mail.ru',
    provider: 'ООО "Объединенные сети" ETHERNET',
  },
  { 
    id: 6, 
    name: 'Соколова Екатерина Петровна', 
    login: 'sokolova.e', 
    debt: 89000, 
    status: 'Ожидается отправка',
    dateSent: '-',
    comment: 'Решение о госпошлине будет принято до 20.01',
    phone: '+7 (999) 678-90-12',
    email: 'sokolova@mail.ru',
    provider: 'ООО "Объединенные сети" LTE',
  },
  { 
    id: 7, 
    name: 'Морозов Дмитрий Сергеевич', 
    login: 'morozov.d', 
    debt: 67000, 
    status: 'Требование отправлено',
    dateSent: '02.01.2025',
    comment: 'Должник согласен на мировое соглашение',
    phone: '+7 (999) 789-01-23',
    email: 'morozov@mail.ru',
    provider: 'ООО "Терранэт" Терранэт',
  },
];

const statusOptions = [
  'Все статусы',
  'Ожидается отправка',
  'Требование отправлено',
  'Ожидается ответ',
];

const providerOptions = [
  'Все провайдеры',
  'ООО "Объединенные сети" ETHERNET',
  'ООО "Объединенные сети" LTE',
  'ООО "Терранэт" Терранэт',
  'ООО "Хороший интернет" ХИ',
];

const getStatusColor = (status, theme) => {
  const isDark = theme?.palette?.mode === 'dark';
  const colors = {
    'Ожидается отправка': { 
      bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', 
      color: '#ff9800' 
    },
    'Требование отправлено': { 
      bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', 
      color: '#2196f3' 
    },
    'Ожидается ответ': { 
      bg: isDark ? 'rgba(156,39,176,0.15)' : 'rgba(156,39,176,0.1)', 
      color: '#9c27b0' 
    },
  };
  return colors[status] || { bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000' };
};

// Функция для парсинга даты из строки ДД.ММ.ГГГГ
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

// Функция для форматирования ввода даты (автоматическая вставка точек)
const formatDateInput = (value) => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, '');
  
  // Если строка пустая, возвращаем пустую строку
  if (digits.length === 0) {
    return '';
  }
  
  // Если длина больше 8, обрезаем
  const trimmed = digits.slice(0, 8);
  
  let formatted = trimmed;
  if (trimmed.length > 2) {
    formatted = trimmed.slice(0, 2) + '.' + trimmed.slice(2);
  }
  if (trimmed.length > 4) {
    formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
  }
  return formatted;
};

const Requirements = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState(initialRequirements);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  
  // Состояния для фильтров
  const [statusFilter, setStatusFilter] = useState('Все статусы');
  const [providerFilter, setProviderFilter] = useState('Все провайдеры');
  const [debtFilterMin, setDebtFilterMin] = useState('');
  const [debtFilterMax, setDebtFilterMax] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  
  // Состояние для Popover фильтров
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Фильтрация
  const filteredRequirements = requirements.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.login.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'Все статусы' || item.status === statusFilter;
    const providerMatch = providerFilter === 'Все провайдеры' || item.provider === providerFilter;
    const minMatch = debtFilterMin === '' || item.debt >= Number(debtFilterMin);
    const maxMatch = debtFilterMax === '' || item.debt <= Number(debtFilterMax);
    
    // Фильтр по диапазону дат
    let dateMatch = true;
    if (dateFromFilter && item.dateSent && item.dateSent !== '-') {
      const itemDate = parseDate(item.dateSent);
      const fromDate = parseDate(dateFromFilter);
      if (itemDate && fromDate) {
        dateMatch = dateMatch && itemDate >= fromDate;
      }
    }
    if (dateToFilter && item.dateSent && item.dateSent !== '-') {
      const itemDate = parseDate(item.dateSent);
      const toDate = parseDate(dateToFilter);
      if (itemDate && toDate) {
        dateMatch = dateMatch && itemDate <= toDate;
      }
    }
    
    return searchMatch && statusMatch && providerMatch && minMatch && maxMatch && dateMatch;
  });

  // Статистика
  const stats = {
    total: requirements.length,
    pending: requirements.filter(r => r.status === 'Ожидается отправка').length,
    sent: requirements.filter(r => r.status === 'Требование отправлено').length,
    waiting: requirements.filter(r => r.status === 'Ожидается ответ').length,
  };

  // Обработчики меню
  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRequirement(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRowClick = (item) => {
    // Открываем в режиме просмотра
    navigate(`/requirements/${item.id}?mode=view`);
  };

  const handleOpenView = () => {
    handleMenuClose();
    // Открываем в режиме просмотра
    navigate(`/requirements/${selectedRequirement.id}?mode=view`);
  };

  const handleEdit = () => {
    handleMenuClose();
    // Открываем в режиме редактирования
    navigate(`/requirements/${selectedRequirement.id}?mode=edit`);
  };

  const handleDelete = () => {
    setRequirements(requirements.filter(item => item.id !== selectedRequirement.id));
    setOpenDeleteDialog(false);
    setSelectedRequirement(null);
    setSnackbar({
      open: true,
      message: `Запись удалена`,
      severity: 'success',
    });
  };

  // Обработчик для передачи в судебное производство
  const handleSendToCourt = () => {
    if (selectedRequirement) {
      setSnackbar({
        open: true,
        message: `Требование по должнику ${selectedRequirement.name} передано в судебное производство`,
        severity: 'success',
      });
      // Здесь можно добавить логику для передачи в суд
      // Например: удалить из списка требований, обновить статус, отправить запрос на API и т.д.
      setRequirements(requirements.filter(item => item.id !== selectedRequirement.id));
      handleMenuClose();
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('Все статусы');
    setProviderFilter('Все провайдеры');
    setDebtFilterMin('');
    setDebtFilterMax('');
    setDateFromFilter('');
    setDateToFilter('');
    setSearchTerm('');
    handleFilterClose();
  };

  const activeFiltersCount = [
    statusFilter !== 'Все статусы',
    providerFilter !== 'Все провайдеры',
    debtFilterMin !== '',
    debtFilterMax !== '',
    dateFromFilter !== '',
    dateToFilter !== '',
    searchTerm !== '',
  ].filter(Boolean).length;

  // Желтый цвет
  const yellowColor = theme.palette.secondary.main;
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)';
  const yellowDark = theme.palette.secondary.dark;
  const greyBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  
  // Цвет текста для суммы долга
  const debtTextColor = isDark ? yellowColor : 'text.primary';

  const StatCard = ({ title, value, color, icon }) => (
    <Paper sx={{ 
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '12px', 
          bgcolor: isDark ? `${color}20` : `${color}15`,
          color: color,
        }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              Требования
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Должники, по которым отправлены требования для передачи дела в суд
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Поиск по ФИО или логину"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                '& input': { color: 'text.primary' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Расширенный фильтр" arrow>
            <IconButton
              onClick={handleFilterClick}
              sx={{
                color: activeFiltersCount > 0 ? yellowColor : 'text.disabled',
                backgroundColor: activeFiltersCount > 0 ? yellowLight : 'transparent',
                border: activeFiltersCount > 0 ? `1px solid ${yellowColor}` : '1px solid',
                borderColor: activeFiltersCount > 0 ? yellowColor : 'divider',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: activeFiltersCount > 0 ? yellowLight : 'action.hover',
                },
                position: 'relative',
              }}
            >
              <FilterIcon />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: yellowColor,
                    color: isDark ? '#0d1445' : '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Popover с фильтрами */}
      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            minWidth: 340,
            maxWidth: 400,
            mt: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Фильтры
          </Typography>
          <Button
            size="small"
            onClick={handleClearFilters}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Сбросить все
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Провайдер */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Провайдер</InputLabel>
            <Select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              label="Провайдер"
              sx={{
                color: 'text.primary',
                '& .MuiSelect-icon': { color: 'text.disabled' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
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
                        bgcolor: yellowLight,
                        color: yellowColor,
                      },
                    },
                  },
                },
              }}
            >
              {providerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Статус */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Статус</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Статус"
              sx={{
                color: 'text.primary',
                '& .MuiSelect-icon': { color: 'text.disabled' },
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: yellowColor },
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
                        bgcolor: yellowLight,
                        color: yellowColor,
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

          {/* Сумма долга */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              Сумма долга
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                type="number"
                placeholder="От"
                value={debtFilterMin}
                onChange={(e) => setDebtFilterMin(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: yellowColor },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: 'text.disabled' }}>₽</InputAdornment>,
                }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="До"
                value={debtFilterMax}
                onChange={(e) => setDebtFilterMax(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                    '&.Mui-focused fieldset': { borderColor: yellowColor },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: 'text.disabled' }}>₽</InputAdornment>,
                }}
              />
            </Box>
          </Box>

          {/* Период даты отправки */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              Период даты отправки (ДД.ММ.ГГГГ)
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  placeholder="От"
                  value={dateFromFilter}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const formatted = formatDateInput(rawValue);
                    setDateFromFilter(formatted);
                  }}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: yellowColor },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  placeholder="До"
                  value={dateToFilter}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const formatted = formatDateInput(rawValue);
                    setDateToFilter(formatted);
                  }}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: yellowColor },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleFilterClose}
            sx={{
              bgcolor: yellowColor,
              color: isDark ? '#0d1445' : '#ffffff',
              mt: 1,
              '&:hover': { bgcolor: yellowDark },
            }}
          >
            Применить
          </Button>
        </Box>
      </Popover>

      {/* Статистика */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Всего требований" 
            value={stats.total} 
            color="#2196f3"
            icon={<EmailIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Ожидается отправка" 
            value={stats.pending} 
            color="#ff9800"
            icon={<PendingIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Требование отправлено" 
            value={stats.sent} 
            color="#2196f3"
            icon={<SendIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Ожидается ответ" 
            value={stats.waiting} 
            color="#9c27b0"
            icon={<ScheduleIcon />}
          />
        </Grid>
      </Grid>

      {/* Таблица */}
      <Paper sx={{ 
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden' 
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>№</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ФИО</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Логин</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Провайдер</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Долг</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Дата отправки</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Статус</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Комментарий</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequirements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  const statusColor = getStatusColor(item.status, theme);
                  return (
                    <TableRow 
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ color: 'text.disabled' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{item.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.login}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.provider}</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: greyBg,
                            color: debtTextColor,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                          }}
                        >
                          {item.debt.toLocaleString()} ₽
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.dateSent}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: statusColor.bg,
                            color: statusColor.color,
                            border: `1px solid ${statusColor.color}30`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      {/* Ячейка с комментарием и Tooltip */}
                      <TableCell 
                        sx={{ 
                          color: 'text.secondary', 
                          maxWidth: 200,
                          cursor: 'pointer',
                        }}
                      >
                        <Tooltip 
                          title={item.comment} 
                          placement="top"
                          arrow
                          enterDelay={500}
                          leaveDelay={200}
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                maxWidth: 400,
                                p: 1.5,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                '& .MuiTooltip-arrow': {
                                  color: 'background.paper',
                                }
                              }
                            },
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              transition: 'color 0.2s',
                              '&:hover': {
                                color: 'primary.main',
                              },
                            }}
                          >
                            {item.comment}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
                          <MoreVertIcon sx={{ color: 'text.disabled' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRequirements.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: 'text.disabled' }}>
              Требования не найдены
            </Typography>
          </Box>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
          component="div"
          count={filteredRequirements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} из ${count}`
          }
          sx={{
            color: 'text.secondary',
            '& .MuiTablePagination-select': {
              color: 'text.primary',
            },
            '& .MuiTablePagination-selectIcon': {
              color: 'text.disabled',
            },
            '& .MuiTablePagination-actions button': {
              color: 'text.disabled',
              '&:hover': {
                color: 'text.primary',
              },
            },
            '& .MuiTablePagination-actions .Mui-disabled': {
              color: 'text.disabled',
            },
          }}
        />
      </Paper>

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleOpenView}>
          <ListItemIcon><ViewIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Просмотреть" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Редактировать" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={handleSendToCourt} sx={{ color: '#ff6f00' }}>
          <ListItemIcon><GavelIcon fontSize="small" sx={{ color: '#ff6f00' }} /></ListItemIcon>
          <ListItemText primary="Передать в судебное производство" sx={{ color: '#ff6f00' }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          setOpenDeleteDialog(true);
        }} sx={{ color: '#f44336' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
          <ListItemText primary="Удалить" sx={{ color: '#f44336' }} />
        </MenuItem>
      </Menu>

      {/* Диалог удаления */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary' }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Вы уверены, что хотите удалить запись для должника <strong style={{ color: 'text.primary' }}>{selectedRequirement?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              color: '#fff',
              '&:hover': { bgcolor: '#d32f2f' },
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default Requirements;