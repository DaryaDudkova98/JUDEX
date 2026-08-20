// src/components/Pages/Debtors.jsx
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
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Popover,
  Checkbox,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  UploadFile as ImportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  FilterList as FilterIcon,
  WorkOutline as WorkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Начальные данные (увеличено количество для тестирования пагинации)
const initialDebtors = [
  { id: 1, name: 'Иванов Иван Иванович', login: 'ivanov.i', debt: 125000, status: 'Новый', phone: '+375 (29) 123-45-67', email: 'ivanov@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 0 },
  { id: 2, name: 'Петров Петр Петрович', login: 'petrov.p', debt: 78000, status: 'В работе', phone: '+375 (29) 234-56-78', email: 'petrov@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 3 },
  { id: 3, name: 'Сидоров Сидор Сидорович', login: 'sidorov.s', debt: 230000, status: 'Новый', phone: '+375 (29) 345-67-89', email: 'sidorov@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 10 },
  { id: 4, name: 'Козлова Анна Ивановна', login: 'kozlova.a', debt: 45000, status: 'В работе', phone: '+375 (29) 456-78-90', email: 'kozlova@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 1 },
  { id: 5, name: 'Михайлов Михаил Михайлович', login: 'mikhailov.m', debt: 152000, status: 'Новый', phone: '+375 (29) 567-89-01', email: 'mikhailov@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 7 },
  { id: 6, name: 'Соколова Екатерина Петровна', login: 'sokolova.e', debt: 89000, status: 'В работе', phone: '+375 (29) 678-90-12', email: 'sokolova@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 0 },
  { id: 7, name: 'Морозов Дмитрий Сергеевич', login: 'morozov.d', debt: 67000, status: 'Новый', phone: '+375 (29) 789-01-23', email: 'morozov@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 4 },
  { id: 8, name: 'Волкова Ольга Александровна', login: 'volkova.o', debt: 195000, status: 'В работе', phone: '+375 (29) 890-12-34', email: 'volkova@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 10 },
  { id: 9, name: 'Новиков Андрей Петрович', login: 'novikov.a', debt: 34000, status: 'Новый', phone: '+375 (29) 901-23-45', email: 'novikov@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 2 },
  { id: 10, name: 'Федоров Федор Федорович', login: 'fedorov.f', debt: 112000, status: 'В работе', phone: '+375 (29) 012-34-56', email: 'fedorov@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 6 },
  { id: 11, name: 'Алексеева Мария Сергеевна', login: 'alekseeva.m', debt: 56000, status: 'Новый', phone: '+375 (29) 123-45-67', email: 'alekseeva@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 0 },
  { id: 12, name: 'Кузнецов Алексей Викторович', login: 'kuznetsov.a', debt: 310000, status: 'В работе', phone: '+375 (29) 234-56-78', email: 'kuznetsov@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 8 },
  { id: 13, name: 'Попова Елена Владимировна', login: 'popova.e', debt: 72000, status: 'Новый', phone: '+375 (29) 345-67-89', email: 'popova@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 10 },
  { id: 14, name: 'Васильев Василий Васильевич', login: 'vasiliev.v', debt: 185000, status: 'В работе', phone: '+375 (29) 456-78-90', email: 'vasiliev@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 3 },
  { id: 15, name: 'Зайцева Татьяна Петровна', login: 'zaitseva.t', debt: 43000, status: 'Новый', phone: '+375 (29) 567-89-01', email: 'zaitseva@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 1 },
  { id: 16, name: 'Смирнов Николай Иванович', login: 'smirnov.n', debt: 267000, status: 'В работе', phone: '+375 (29) 678-90-12', email: 'smirnov@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 5 },
  { id: 17, name: 'Павлова Ольга Дмитриевна', login: 'pavlova.o', debt: 94000, status: 'Новый', phone: '+375 (29) 789-01-23', email: 'pavlova@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 0 },
  { id: 18, name: 'Егоров Егор Егорович', login: 'egorov.e', debt: 158000, status: 'В работе', phone: '+375 (29) 890-12-34', email: 'egorov@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 9 },
  { id: 19, name: 'Николаева Анна Сергеевна', login: 'nikolaeva.a', debt: 69000, status: 'Новый', phone: '+375 (29) 901-23-45', email: 'nikolaeva@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 4 },
  { id: 20, name: 'Григорьев Григорий Петрович', login: 'grigoriev.g', debt: 203000, status: 'В работе', phone: '+375 (29) 012-34-56', email: 'grigoriev@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 2 },
  { id: 21, name: 'Дмитриева Екатерина Алексеевна', login: 'dmitrieva.e', debt: 87000, status: 'Новый', phone: '+375 (29) 123-45-67', email: 'dmitrieva@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 7 },
  { id: 22, name: 'Борисов Борис Борисович', login: 'borisov.b', debt: 144000, status: 'В работе', phone: '+375 (29) 234-56-78', email: 'borisov@mail.ru', provider: 'ООО "Объединенные сети" LTE', touches: 10 },
  { id: 23, name: 'Крылова Мария Ивановна', login: 'krylova.m', debt: 52000, status: 'Новый', phone: '+375 (29) 345-67-89', email: 'krylova@mail.ru', provider: 'ООО "Терранэт" Терранэт', touches: 0 },
  { id: 24, name: 'Ильин Илья Ильич', login: 'ilin.i', debt: 276000, status: 'В работе', phone: '+375 (29) 456-78-90', email: 'ilin@mail.ru', provider: 'ООО "Хороший интернет" ХИ', touches: 6 },
  { id: 25, name: 'Тихонова Наталья Викторовна', login: 'tihonova.n', debt: 83000, status: 'Новый', phone: '+375 (29) 567-89-01', email: 'tihonova@mail.ru', provider: 'ООО "Объединенные сети" ETHERNET', touches: 3 },
];

const statusOptions = ['Новый', 'В работе'];
const providerOptions = [
  'Все провайдеры',
  'ООО "Объединенные сети" ETHERNET',
  'ООО "Объединенные сети" LTE',
  'ООО "Терранэт" Терранэт',
  'ООО "Хороший интернет" ХИ',
];

const touchOptions = ['Все', 'Без касаний (0)', 'В процессе (1-9)', 'Завершено (10)'];

const getStatusColor = (status, theme) => {
  const isDark = theme.palette.mode === 'dark';
  switch(status) {
    case 'Новый': 
      return { 
        bg: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', 
        color: '#2196f3' 
      };
    case 'В работе': 
      return { 
        bg: isDark ? 'rgba(156,39,176,0.15)' : 'rgba(156,39,176,0.1)', 
        color: '#9c27b0' 
      };
    default: 
      return { 
        bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
        color: theme.palette.text.primary 
      };
  }
};

const Debtors = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [debtors, setDebtors] = useState(initialDebtors);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  
  // Состояния для фильтров (в расширенной фильтрации)
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('Все провайдеры');
  const [touchFilter, setTouchFilter] = useState('Все');
  const [debtFilterMin, setDebtFilterMin] = useState('');
  const [debtFilterMax, setDebtFilterMax] = useState('');
  
  // Состояние для Popover фильтров
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);
  
  // Состояния для диалогов
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openMoveToRequirementsDialog, setOpenMoveToRequirementsDialog] = useState(false);
  
  // Состояния для импорта
  const [importFile, setImportFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  
  // Состояния для уведомлений
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Обработчик изменения количества касаний
  const handleTouchChange = (debtorId, delta) => {
    setDebtors(debtors.map(d => {
      if (d.id === debtorId) {
        const newTouches = Math.max(0, Math.min(10, d.touches + delta));
        return { ...d, touches: newTouches };
      }
      return d;
    }));
    
    const debtor = debtors.find(d => d.id === debtorId);
    const newTouches = Math.max(0, Math.min(10, (debtor?.touches || 0) + delta));
    setSnackbar({
      open: true,
      message: `Касаний: ${newTouches}/10 ${newTouches === 10 ? '✅ Достигнут максимум!' : ''}`,
      severity: newTouches === 10 ? 'success' : 'info',
    });
  };

  // Фильтрация
  const getFiltered = () => {
    let result = debtors.filter(debtor => {
      // Поиск только по ФИО и логину
      const searchMatch = debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debtor.login.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фильтры из расширенной фильтрации
      const statusMatch = statusFilter === '' || debtor.status === statusFilter;
      const providerMatch = providerFilter === 'Все провайдеры' || debtor.provider === providerFilter;
      const minMatch = debtFilterMin === '' || debtor.debt >= Number(debtFilterMin);
      const maxMatch = debtFilterMax === '' || debtor.debt <= Number(debtFilterMax);
      
      // Фильтр по касаниям
      let touchMatch = true;
      if (touchFilter === 'Без касаний (0)') touchMatch = debtor.touches === 0;
      else if (touchFilter === 'В процессе (1-9)') touchMatch = debtor.touches > 0 && debtor.touches < 10;
      else if (touchFilter === 'Завершено (10)') touchMatch = debtor.touches === 10;
      
      return searchMatch && statusMatch && providerMatch && minMatch && maxMatch && touchMatch;
    });

    return result;
  };

  const filteredDebtors = getFiltered();
  const completedCount = debtors.filter(d => d.touches === 10).length;

  // Обработчики меню
  const handleMenuOpen = (event, debtor) => {
    setAnchorEl(event.currentTarget);
    setSelectedDebtor(debtor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Обработчики фильтров
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setProviderFilter('Все провайдеры');
    setTouchFilter('Все');
    setDebtFilterMin('');
    setDebtFilterMax('');
    setSearchTerm('');
    handleFilterClose();
  };

  // Обработчики диалогов
  const handleOpenView = () => {
    handleMenuClose();
    navigate(`/debtors/${selectedDebtor.id}`);
  };

  const handleOpenEdit = () => {
    handleMenuClose();
    navigate(`/debtors/${selectedDebtor.id}?mode=edit`);
  };

  const handleOpenDelete = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleOpenMoveToRequirements = () => {
    handleMenuClose();
    setOpenMoveToRequirementsDialog(true);
  };

  // Удаление должника
  const handleDelete = () => {
    setDebtors(debtors.filter(d => d.id !== selectedDebtor.id));
    setOpenDeleteDialog(false);
    setSelectedDebtor(null);
    setSnackbar({
      open: true,
      message: `Должник ${selectedDebtor.name} удален`,
      severity: 'success',
    });
  };

  // Перемещение в требования
  const handleMoveToRequirements = () => {
    setDebtors(debtors.filter(d => d.id !== selectedDebtor.id));
    setOpenMoveToRequirementsDialog(false);
    setSelectedDebtor(null);
    setSnackbar({
      open: true,
      message: `Должник ${selectedDebtor?.name} перемещен в раздел "Требования"`,
      severity: 'success',
    });
  };

  // Импорт из Excel
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const mappedData = jsonData.map((row, index) => ({
            id: Date.now() + index,
            name: row['ФИО'] || row['name'] || row['Имя'] || '',
            login: row['Логин'] || row['login'] || '',
            debt: Number(row['Долг'] || row['debt'] || 0),
            status: row['Статус'] || row['status'] || 'Новый',
            phone: row['Телефон'] || row['phone'] || '',
            email: row['Email'] || row['email'] || '',
            provider: row['Провайдер'] || row['provider'] || '',
            touches: 0,
          }));
          
          setImportData(mappedData);
        } catch (error) {
          setSnackbar({
            open: true,
            message: 'Ошибка при чтении файла. Проверьте формат данных.',
            severity: 'error',
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImport = () => {
    setImportLoading(true);
    setTimeout(() => {
      setDebtors([...debtors, ...importData]);
      setImportLoading(false);
      setOpenImportDialog(false);
      setImportFile(null);
      setImportData([]);
      setSnackbar({
        open: true,
        message: `Успешно импортировано ${importData.length} должников`,
        severity: 'success',
      });
    }, 1000);
  };

  // Экспорт в Excel
  const handleExport = () => {
    const exportData = filteredDebtors.map(d => ({
      'ФИО': d.name,
      'Логин': d.login,
      'Долг': d.debt,
      'Статус': d.status,
      'Телефон': d.phone,
      'Email': d.email,
      'Провайдер': d.provider,
      'Касаний': d.touches,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Должники');
    XLSX.writeFile(wb, `должники_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setSnackbar({
      open: true,
      message: 'Экспорт выполнен успешно',
      severity: 'success',
    });
  };

  // Подсчет активных фильтров
  const activeFiltersCount = [
    statusFilter !== '',
    providerFilter !== 'Все провайдеры',
    touchFilter !== 'Все',
    debtFilterMin !== '',
    debtFilterMax !== '',
    searchTerm !== '',
  ].filter(Boolean).length;

  // Желтый цвет
  const yellowColor = theme.palette.secondary.main;
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)';
  const yellowDark = theme.palette.secondary.dark;
  const greyBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  
  // Цвет текста для суммы долга
  const debtTextColor = isDark ? yellowColor : 'text.primary';

  // Стили для Paper
  const paperSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Должники
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Всего: {filteredDebtors.length} должников | 
            <span style={{ color: '#4caf50', marginLeft: 4 }}>✅ {completedCount} завершено (10/10)</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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

          <Button
            variant="contained"
            startIcon={<ImportIcon />}
            onClick={() => setOpenImportDialog(true)}
            sx={{
              bgcolor: isDark ? 'rgba(33,150,243,0.2)' : 'rgba(33,150,243,0.1)',
              color: '#2196f3',
              border: '1px solid rgba(33,150,243,0.3)',
              '&:hover': { 
                bgcolor: isDark ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.2)',
              },
            }}
          >
            Импорт
          </Button>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            onClick={handleExport}
            sx={{
              bgcolor: isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)',
              color: '#4caf50',
              border: '1px solid rgba(76,175,80,0.3)',
              '&:hover': { 
                bgcolor: isDark ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)',
              },
            }}
          >
            Экспорт
          </Button>
        </Box>
      </Box>

      {/* Popover с расширенными фильтрами */}
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
            minWidth: 320,
            maxWidth: 400,
            mt: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Расширенный фильтр
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
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

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
              <MenuItem value="">Все статусы</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'text.secondary' }}>Касания</InputLabel>
            <Select
              value={touchFilter}
              onChange={(e) => setTouchFilter(e.target.value)}
              label="Касания"
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
              {touchOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

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
                  '& input[type=number]::-webkit-inner-spin-button': {
                    opacity: 1,
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
                  '& input[type=number]::-webkit-inner-spin-button': {
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: 'text.disabled' }}>₽</InputAdornment>,
                }}
              />
            </Box>
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

      {/* Таблица */}
      <Paper sx={paperSx}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: 50 }}>№</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ФИО</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Логин</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Провайдер</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Долг</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Статус</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: 160 }} align="center">
                  <Tooltip title="Количество касаний (макс. 10)" arrow>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <WorkIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>Касания</Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDebtors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((debtor, index) => {
                  const statusColors = getStatusColor(debtor.status, theme);
                  const isCompleted = debtor.touches === 10;
                  return (
                    <TableRow 
                      key={debtor.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: isCompleted ? isDark ? 'rgba(76,175,80,0.03)' : 'rgba(76,175,80,0.02)' : 'transparent',
                      }}
                    >
                      <TableCell sx={{ color: 'text.disabled' }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{debtor.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{debtor.login}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{debtor.provider}</TableCell>
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
                          {debtor.debt.toLocaleString()} ₽
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.status}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.color}30`,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Уменьшить касание" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleTouchChange(debtor.id, -1)}
                              disabled={debtor.touches === 0}
                              sx={{
                                color: 'text.disabled',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                                '&.Mui-disabled': {
                                  color: 'text.disabled',
                                  opacity: 0.3,
                                },
                              }}
                            >
                              <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}>
                            <Badge
                              badgeContent={debtor.touches}
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  minWidth: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  backgroundColor: isCompleted ? '#4caf50' : isDark ? 'rgba(255,215,0,0.85)' : '#ffd700',
                                  color: isCompleted ? '#fff' : isDark ? '#0d1445' : '#1a1a2e',
                                  border: `1px solid ${isCompleted ? 'rgba(76,175,80,0.3)' : isDark ? 'rgba(255,215,0,0.3)' : 'rgba(255,215,0,0.3)'}`,
                                  position: 'relative',
                                  transform: 'none',
                                },
                              }}
                            >
                              <Box sx={{ width: 28, height: 28 }} />
                            </Badge>
                          </Box>
                          
                          <Tooltip title="Увеличить касание" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleTouchChange(debtor.id, 1)}
                              disabled={debtor.touches === 10}
                              sx={{
                                color: 'text.disabled',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                                '&.Mui-disabled': {
                                  color: 'text.disabled',
                                  opacity: 0.3,
                                },
                              }}
                            >
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, debtor)}>
                          <MoreVertIcon sx={{ color: 'text.disabled' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredDebtors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: 'text.disabled' }}>
              Должники не найдены
            </Typography>
          </Box>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
          component="div"
          count={filteredDebtors.length}
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
        <MenuItem onClick={handleOpenEdit}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
          <ListItemText primary="Редактировать" sx={{ color: 'text.primary' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenMoveToRequirements} sx={{ color: '#ff9800' }}>
          <ListItemIcon><SendIcon fontSize="small" sx={{ color: '#ff9800' }} /></ListItemIcon>
          <ListItemText primary="Отправить в требования" sx={{ color: '#ff9800' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenDelete} sx={{ color: '#f44336' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
          <ListItemText primary="Удалить" sx={{ color: '#f44336' }} />
        </MenuItem>
      </Menu>

      {/* Диалог перемещения в требования */}
      <Dialog
        open={openMoveToRequirementsDialog}
        onClose={() => setOpenMoveToRequirementsDialog(false)}
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
          Перемещение в раздел "Требования"
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Вы уверены, что хотите переместить должника <strong style={{ color: 'text.primary' }}>{selectedDebtor?.name}</strong> в раздел "Требования"?
            <br />
            <br />
            После перемещения должник будет доступен для работы в разделе требований.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenMoveToRequirementsDialog(false)} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            onClick={handleMoveToRequirements}
            variant="contained"
            sx={{
              bgcolor: '#ff9800',
              color: '#fff',
              '&:hover': { bgcolor: '#f57c00' },
            }}
          >
            Переместить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог импорта */}
      <Dialog 
        open={openImportDialog} 
        onClose={() => setOpenImportDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Импорт из Excel
          <IconButton onClick={() => setOpenImportDialog(false)}>
            <CloseIcon sx={{ color: 'text.secondary' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ 
              mb: 3, 
              bgcolor: isDark ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.05)',
              color: isDark ? '#90caf9' : '#1565c0',
              border: '1px solid rgba(33,150,243,0.2)',
            }}>
              Поддерживаются файлы .xlsx и .xls. 
              <br />
              <strong>Необходимые колонки:</strong> ФИО, Логин, Долг, Провайдер, Статус (опционально), Телефон (опционально), Email (опционально)
            </Alert>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                py: 3,
                border: `2px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                borderRadius: 2,
                color: 'text.secondary',
                '&:hover': { 
                  borderColor: yellowColor,
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {importFile ? importFile.name : 'Выберите файл Excel'}
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
            </Button>

            {importData.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                  Найдено {importData.length} записей для импорта
                </Typography>
                <Paper sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto', 
                  bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary' }}>ФИО</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>Логин</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }} align="right">Долг</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {importData.slice(0, 5).map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: 'text.primary', fontSize: '0.85rem' }}>{item.name}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{item.login}</TableCell>
                          <TableCell sx={{ color: debtTextColor, fontSize: '0.85rem' }} align="right">
                            {item.debt.toLocaleString()} ₽
                          </TableCell>
                        </TableRow>
                      ))}
                      {importData.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ color: 'text.disabled', textAlign: 'center' }}>
                            ... и еще {importData.length - 5} записей
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenImportDialog(false)} sx={{ color: 'text.secondary' }}>
            Отмена
          </Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={importData.length === 0 || importLoading}
            sx={{
              bgcolor: yellowColor,
              color: isDark ? '#0d1445' : '#ffffff',
              '&:hover': { bgcolor: yellowDark },
              '&.Mui-disabled': { 
                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              },
            }}
          >
            {importLoading ? 'Импорт...' : 'Импортировать'}
          </Button>
        </DialogActions>
        {importLoading && <LinearProgress sx={{ bgcolor: isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: yellowColor } }} />}
      </Dialog>

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
            Вы уверены, что хотите удалить должника <strong style={{ color: 'text.primary' }}>{selectedDebtor?.name}</strong>?
            <br />
            <br />
            Это действие необратимо.
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
              : (isDark ? 'rgba(33,150,243,0.2)' : 'rgba(33,150,243,0.1)'),
            color: snackbar.severity === 'success' ? '#81c784' : '#90caf9',
            border: `1px solid ${snackbar.severity === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(33,150,243,0.3)'}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Debtors;