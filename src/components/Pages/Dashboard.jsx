// src/components/Pages/Dashboard.jsx
import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  TablePagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Popover,
  Button,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Gavel as GavelIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Wifi as WifiIcon,
  SettingsEthernet as EthernetIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Данные для статистики
const stats = [
  { 
    title: 'Всего должников', 
    value: '1,284', 
    icon: <PeopleIcon />, 
    color: '#2196f3',
  },
  { 
    title: 'В процессе взыскания', 
    value: '342', 
    icon: <GavelIcon />, 
    color: '#ff9800',
  },
  { 
    title: 'В процессе работы', 
    value: '156', 
    icon: <WarningIcon />, 
    color: '#9c27b0',
  },
  { 
    title: 'Погасили долг до юриста', 
    value: '786', 
    icon: <PaymentIcon />, 
    color: '#4caf50',
  },
];

// Данные для провайдеров
const providers = [
  { name: 'Общий', value: '1,284', icon: <PeopleIcon />, color: '#2196f3' },
  { name: 'LTE', value: '456', icon: <WifiIcon />, color: '#ff9800' },
  { name: 'ETHERNET', value: '828', icon: <EthernetIcon />, color: '#4caf50' },
];

// Данные для таблицы должников с провайдерами
const debtorsData = [
  { id: 1, name: 'Иванов Иван Иванович', login: 'ivanov.i', debt: 125000, debtFormatted: '125 000 ₽', status: 'Взыскание', provider: 'ООО "Объединенные сети" ОС' },
  { id: 2, name: 'Петров Петр Петрович', login: 'petrov.p', debt: 78000, debtFormatted: '78 000 ₽', status: 'Работа', provider: 'ООО "Объединенные сети" LTE' },
  { id: 3, name: 'Сидоров Сидор Сидорович', login: 'sidorov.s', debt: 230000, debtFormatted: '230 000 ₽', status: 'Взыскание', provider: 'ООО "Терранэт" Терранэт' },
  { id: 4, name: 'Козлова Анна Ивановна', login: 'kozlova.a', debt: 45000, debtFormatted: '45 000 ₽', status: 'Погашен', provider: 'ООО "Хороший интернет" ХИ' },
  { id: 5, name: 'Михайлов Михаил Михайлович', login: 'mikhailov.m', debt: 152000, debtFormatted: '152 000 ₽', status: 'Работа', provider: 'ООО "Объединенные сети" ОС' },
  { id: 6, name: 'Соколова Екатерина Петровна', login: 'sokolova.e', debt: 89000, debtFormatted: '89 000 ₽', status: 'Взыскание', provider: 'ООО "Терранэт" Терранэт' },
  { id: 7, name: 'Морозов Дмитрий Сергеевич', login: 'morozov.d', debt: 67000, debtFormatted: '67 000 ₽', status: 'Работа', provider: 'ООО "Объединенные сети" LTE' },
  { id: 8, name: 'Волкова Ольга Александровна', login: 'volkova.o', debt: 195000, debtFormatted: '195 000 ₽', status: 'Взыскание', provider: 'ООО "Хороший интернет" ХИ' },
  { id: 9, name: 'Новиков Андрей Петрович', login: 'novikov.a', debt: 34000, debtFormatted: '34 000 ₽', status: 'Погашен', provider: 'ООО "Объединенные сети" ОС' },
  { id: 10, name: 'Федоров Федор Федорович', login: 'fedorov.f', debt: 112000, debtFormatted: '112 000 ₽', status: 'Взыскание', provider: 'ООО "Объединенные сети" LTE' },
  { id: 11, name: 'Алексеева Мария Сергеевна', login: 'alekseeva.m', debt: 56000, debtFormatted: '56 000 ₽', status: 'Работа', provider: 'ООО "Терранэт" Терранэт' },
  { id: 12, name: 'Кузнецов Алексей Викторович', login: 'kuznetsov.a', debt: 310000, debtFormatted: '310 000 ₽', status: 'Взыскание', provider: 'ООО "Хороший интернет" ХИ' },
  { id: 13, name: 'Попова Елена Владимировна', login: 'popova.e', debt: 72000, debtFormatted: '72 000 ₽', status: 'Погашен', provider: 'ООО "Объединенные сети" ОС' },
  { id: 14, name: 'Васильев Василий Васильевич', login: 'vasiliev.v', debt: 185000, debtFormatted: '185 000 ₽', status: 'Работа', provider: 'ООО "Объединенные сети" LTE' },
  { id: 15, name: 'Зайцева Татьяна Петровна', login: 'zaitseva.t', debt: 43000, debtFormatted: '43 000 ₽', status: 'Взыскание', provider: 'ООО "Терранэт" Терранэт' },
];

// Уникальные провайдеры для фильтра
const uniqueProviders = [...new Set(debtorsData.map(d => d.provider))];
const statusOptions = ['Все статусы', 'Взыскание', 'Работа', 'Погашен'];

const getStatusColor = (status, theme) => {
  const isDark = theme.palette.mode === 'dark';
  switch(status) {
    case 'Взыскание': 
      return { 
        bg: isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)', 
        color: '#ff9800' 
      };
    case 'Работа': 
      return { 
        bg: isDark ? 'rgba(156,39,176,0.15)' : 'rgba(156,39,176,0.1)', 
        color: '#9c27b0' 
      };
    case 'Погашен': 
      return { 
        bg: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.1)', 
        color: '#4caf50' 
      };
    default: 
      return { 
        bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
        color: theme.palette.text.primary 
      };
  }
};

const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Все провайдеры');
  const [selectedStatus, setSelectedStatus] = useState('Все статусы');
  const [debtFilterMin, setDebtFilterMin] = useState('');
  const [debtFilterMax, setDebtFilterMax] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);

  // Подсчет активных фильтров
  const activeFiltersCount = [
    selectedProvider !== 'Все провайдеры',
    selectedStatus !== 'Все статусы',
    debtFilterMin !== '',
    debtFilterMax !== '',
    searchTerm !== '',
  ].filter(Boolean).length;

  // Фильтрация данных
  const filteredDebtors = debtorsData.filter(debtor => {
    // Поиск по ФИО и логину
    const searchMatch = debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        debtor.login.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Фильтр по провайдеру
    const providerMatch = selectedProvider === 'Все провайдеры' || debtor.provider === selectedProvider;
    
    // Фильтр по статусу
    const statusMatch = selectedStatus === 'Все статусы' || debtor.status === selectedStatus;
    
    // Фильтр по сумме долга
    const minMatch = debtFilterMin === '' || debtor.debt >= Number(debtFilterMin);
    const maxMatch = debtFilterMax === '' || debtor.debt <= Number(debtFilterMax);
    
    return searchMatch && providerMatch && statusMatch && minMatch && maxMatch;
  });

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDebtors = filteredDebtors.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setSelectedProvider('Все провайдеры');
    setSelectedStatus('Все статусы');
    setDebtFilterMin('');
    setDebtFilterMax('');
    setSearchTerm('');
    setPage(0);
    handleFilterClose();
  };

  const handleApplyFilters = () => {
    setPage(0);
    handleFilterClose();
  };

  const yellowColor = theme.palette.secondary.main;
  const yellowLight = isDark ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.12)';
  const yellowDark = theme.palette.secondary.dark;
  const greyBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  
  // Цвет текста для суммы долга
  const debtTextColor = isDark ? yellowColor : 'text.primary';

  // Стили для Paper
  const paperSx = {
    p: 3,
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  };

  // Стили для статистических карточек
  const statCardSx = (color) => ({
    p: 3,
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
        Панель управления
      </Typography>

      {/* Статистика */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Paper sx={statCardSx(stat.color)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: isDark ? `${stat.color}20` : `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Провайдеры */}
      <Paper sx={{ ...paperSx, mt: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
          Провайдеры
        </Typography>
        <Grid container spacing={2}>
          {providers.map((provider, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              }}>
                <Avatar sx={{ bgcolor: `${provider.color}20`, color: provider.color }}>
                  {provider.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {provider.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {provider.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Таблица */}
      <Paper sx={{ ...paperSx, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Список должников
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              placeholder="Поиск по ФИО или логину"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
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
                <FilterListIcon />
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
              minWidth: 320,
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
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'text.secondary' }}>Провайдер</InputLabel>
              <Select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
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
                <MenuItem value="Все провайдеры">Все провайдеры</MenuItem>
                {uniqueProviders.map((provider) => (
                  <MenuItem key={provider} value={provider}>{provider}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'text.secondary' }}>Статус</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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

            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyFilters}
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ФИО</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Логин</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Провайдер</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }} align="right">Долг</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDebtors.map((debtor) => {
                const statusColors = getStatusColor(debtor.status, theme);
                return (
                  <TableRow key={debtor.id} sx={{ 
                    '&:hover': { 
                      bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' 
                    },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}>
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
                        {debtor.debtFormatted}
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
                        }}
                      />
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

        {filteredDebtors.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
            component="div"
            count={filteredDebtors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} из ${count}`
            }
            sx={{
              color: 'text.secondary',
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 2,
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
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;